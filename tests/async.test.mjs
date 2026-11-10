import test from "node:test";
import assert from "node:assert/strict";
import { observeWrite, withTimeout } from "../src/services/async.js";

function deferred() {
  let resolve, reject;
  const promise = new Promise((ok, fail) => {
    resolve = ok;
    reject = fail;
  });
  return { promise, resolve, reject };
}
function callbacks(events) {
  return {
    onWaiting: () => events.push("waiting"),
    onSuccess: () => events.push("confirmed"),
    onError: () => events.push("failed"),
  };
}

test("write lambat melepas spinner tetapi tidak dianggap sukses; konfirmasi terlambat tetap diproses", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const operation = deferred();
  const events = [];
  observeWrite(operation.promise, callbacks(events));
  t.mock.timers.tick(10000);
  assert.deepEqual(events, ["waiting"]);
  operation.resolve();
  await Promise.resolve();
  assert.deepEqual(events, ["waiting", "confirmed"]);
});

test("penolakan server setelah status menunggu tetap menjadi gagal, bukan sukses", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const operation = deferred();
  const events = [];
  observeWrite(operation.promise, callbacks(events));
  t.mock.timers.tick(10000);
  operation.reject(new Error("permission-denied"));
  await Promise.resolve();
  assert.deepEqual(events, ["waiting", "failed"]);
});

test("write cepat tidak menyisakan timer yang mengubah UI menjadi menunggu", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const events = [];
  observeWrite(Promise.resolve(), callbacks(events));
  await Promise.resolve();
  t.mock.timers.tick(10000);
  assert.deepEqual(events, ["confirmed"]);
});

test("cleanup mencegah callback timer dan hasil write mengubah layar setelah logout", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const operation = deferred();
  const events = [];
  const stop = observeWrite(operation.promise, callbacks(events));
  stop();
  t.mock.timers.tick(10000);
  operation.resolve();
  await Promise.resolve();
  assert.deepEqual(events, []);
});

test("permintaan sesi yang tidak merespons berhenti dengan error yang dapat dicoba ulang", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const operation = deferred();
  const result = assert.rejects(
    withTimeout(operation.promise, 12000, "auth/network-request-failed"),
    { code: "auth/network-request-failed" },
  );
  t.mock.timers.tick(12000);
  await result;
});
