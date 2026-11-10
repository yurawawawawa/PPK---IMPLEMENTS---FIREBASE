export function validateStudent(input) {
  const student = {
    nama: input.nama.trim(),
    nim: input.nim.trim(),
    prodi: input.prodi.trim(),
  };
  if (
    !student.nama ||
    student.nama.length > 100 ||
    !student.prodi ||
    student.prodi.length > 100
  ) {
    throw new Error(
      "Nama dan program studi wajib diisi (maksimal 100 karakter).",
    );
  }
  if (!/^[0-9]{5,20}$/.test(student.nim))
    throw new Error("NIM harus berisi 5-20 angka.");
  return student;
}
