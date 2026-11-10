export function withTimeout(operation, milliseconds, code) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(Object.assign(new Error("Koneksi belum merespons."), { code })),
      milliseconds,
    );
    Promise.resolve(operation).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

// Batas tunggu UI tidak membatalkan write Firestore yang sudah masuk antrean.
// Tetap tunggu hasil akhirnya, tanpa menganggap timeout sebagai sukses/gagal.
export function observeWrite(
  operation,
  { onWaiting, onSuccess, onError },
  milliseconds = 10000,
) {
  let active = true;
  const timer = setTimeout(() => {
    if (active) onWaiting();
  }, milliseconds);
  Promise.resolve(operation).then(
    (value) => {
      clearTimeout(timer);
      if (active) onSuccess(value);
    },
    (error) => {
      clearTimeout(timer);
      if (active) onError(error);
    },
  );
  return () => {
    active = false;
    clearTimeout(timer);
  };
}
