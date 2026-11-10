import test from "node:test";
import assert from "node:assert/strict";
import { validateStudent } from "../src/services/validation.js";

test("input dibersihkan dan NIM dipertahankan sebagai string termasuk nol awal", () => {
  assert.deepEqual(
    validateStudent({
      nama: " Alya ",
      nim: " 00123456 ",
      prodi: " Informatika ",
    }),
    {
      nama: "Alya",
      nim: "00123456",
      prodi: "Informatika",
    },
  );
});
test("nama atau prodi kosong dan terlalu panjang ditolak", () => {
  const valid = { nama: "Alya", nim: "24060123120001", prodi: "Informatika" };
  for (const input of [
    { ...valid, nama: "   " },
    { ...valid, prodi: "" },
    { ...valid, nama: "a".repeat(101) },
  ]) {
    assert.throws(() => validateStudent(input), /wajib diisi/);
  }
});
test("NIM bukan angka, terlalu pendek, atau terlalu panjang ditolak", () => {
  for (const nim of ["1234", "12abc678", "1".repeat(21)]) {
    assert.throws(
      () => validateStudent({ nama: "Alya", nim, prodi: "Informatika" }),
      /5-20 angka/,
    );
  }
});
