import test from "node:test";
import assert from "node:assert/strict";
import {
  LOGIN_INFO_KEY,
  restoreSession,
  clearLoginInfo,
  isInvalidSession,
} from "../src/services/session.js";

function localStorage() {
  const data = new Map();
  return {
    data,
    async setItem(key, value) {
      data.set(key, value);
    },
    async removeItem(key) {
      data.delete(key);
    },
  };
}
function firebaseUser(getIdTokenResult) {
  return {
    uid: "user-1",
    displayName: "Alya",
    email: "alya@example.com",
    getIdTokenResult,
  };
}

test("sesi valid memakai token SDK tanpa memaksa refresh dan menyimpan profil JSON", async () => {
  const storage = localStorage();
  let forceRefresh;
  const user = firebaseUser(async (force) => {
    forceRefresh = force;
    return { expirationTime: new Date(Date.now() + 3600000).toISOString() };
  });
  const profile = await restoreSession(user, storage);
  assert.equal(forceRefresh, undefined);
  assert.equal(profile.uid, user.uid);
  assert.deepEqual(JSON.parse(storage.data.get(LOGIN_INFO_KEY)), profile);
});

test("cache profil saja tidak membypass login; tanpa sesi Firebase cache dibersihkan", async () => {
  const storage = localStorage();
  await storage.setItem(LOGIN_INFO_KEY, JSON.stringify({ uid: "cache-palsu" }));
  assert.equal(await restoreSession(null, storage), null);
  assert.equal(storage.data.has(LOGIN_INFO_KEY), false);
});

test("token kedaluwarsa ditolak sebelum profil ditulis", async () => {
  const storage = localStorage();
  const user = firebaseUser(async () => ({
    expirationTime: "2020-01-01T00:00:00Z",
  }));
  await assert.rejects(restoreSession(user, storage), {
    code: "auth/user-token-expired",
  });
  assert.equal(storage.data.size, 0);
});

test("token dicabut atau pengguna dinonaktifkan mengharuskan login ulang", async () => {
  const storage = localStorage();
  const error = Object.assign(new Error("disabled"), {
    code: "auth/user-disabled",
  });
  const user = firebaseUser(async () => {
    throw error;
  });
  await assert.rejects(restoreSession(user, storage), error);
  assert.equal(isInvalidSession(error), true);
  assert.equal(storage.data.size, 0);
});

test("gangguan jaringan mempertahankan cache tetapi tidak membuka home", async () => {
  const storage = localStorage();
  await storage.setItem(LOGIN_INFO_KEY, "profil-lama");
  const error = Object.assign(new Error("offline"), {
    code: "auth/network-request-failed",
  });
  const user = firebaseUser(async () => {
    throw error;
  });
  await assert.rejects(restoreSession(user, storage), error);
  assert.equal(isInvalidSession(error), false);
  assert.equal(storage.data.get(LOGIN_INFO_KEY), "profil-lama");
});

test("keluar menghapus profil lokal", async () => {
  const storage = localStorage();
  await storage.setItem(LOGIN_INFO_KEY, "profil");
  await clearLoginInfo(storage);
  assert.equal(storage.data.size, 0);
});

test("sesi macet tidak menulis profil sukses setelah batas tunggu habis", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const storage = localStorage();
  let finish;
  const user = firebaseUser(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const rejected = assert.rejects(restoreSession(user, storage), {
    code: "auth/network-request-failed",
  });
  t.mock.timers.tick(12000);
  await rejected;
  finish({ expirationTime: new Date(Date.now() + 3600000).toISOString() });
  await Promise.resolve();
  assert.equal(storage.data.size, 0);
});
