import { withTimeout } from "./async.js";

export const LOGIN_INFO_KEY = "@mahasiswa/loginInfo";
export function clearLoginInfo(storage) {
  return storage.removeItem(LOGIN_INFO_KEY);
}
export function isInvalidSession(error) {
  return [
    "auth/user-token-expired",
    "auth/invalid-user-token",
    "auth/user-disabled",
    "auth/user-not-found",
    "auth/id-token-revoked",
  ].includes(error?.code);
}
export async function restoreSession(user, storage) {
  if (!user) {
    await clearLoginInfo(storage);
    return null;
  }
  // Pakai token Firebase yang masih aktif; SDK memperbaruinya saat diperlukan.
  // Jaringan yang macet tidak boleh menahan halaman loading tanpa batas.
  const token = await withTimeout(
    user.getIdTokenResult(),
    12000,
    "auth/network-request-failed",
  );
  const expiresAt = Date.parse(token.expirationTime);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    throw Object.assign(new Error("Sesi kedaluwarsa."), {
      code: "auth/user-token-expired",
    });
  }
  const profile = {
    uid: user.uid,
    name: user.displayName || "Pengguna",
    email: user.email || "",
    expiresAt,
  };
  // Profil tugas; token + refresh token dikelola SDK melalui AsyncStorage.
  await storage.setItem(LOGIN_INFO_KEY, JSON.stringify(profile));
  return profile;
}
