# Rekaman penjelasan tugas (target 55 detik)

Rekam aplikasi Android yang sudah terhubung ke Firebase milikmu. Naskah ini adalah panduan rekaman, bukan bukti bahwa demo cloud sudah dijalankan.

Sebelum merekam: login Google harus sudah berhasil, masukkan 2-3 data mahasiswa contoh, siapkan halaman Firestore `students`, lalu logout. Gunakan nama dan NIM contoh. Latih sekali dan cek durasi file akhirnya tetap di bawah 60 detik.

| Waktu     | Tampilan / tindakan                                                          | Narasi                                                                                                                                               |
| --------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0-5 dtk   | Halaman login                                                                | "Ini aplikasi React Native Expo untuk menampilkan data mahasiswa menggunakan Firebase."                                                              |
| 5-14 dtk  | Tekan Masuk dengan Google, pilih akun, masuk home                            | "Login menggunakan Google melalui Firebase Authentication. Setelah berhasil, informasi login disimpan secara lokal dengan AsyncStorage."             |
| 14-24 dtk | Tunjukkan daftar; tekan + Tambah mahasiswa dan isi form                      | "Home menampilkan mahasiswa dari Cloud Firestore. Data berisi nama, NIM, dan program studi."                                                         |
| 24-33 dtk | Simpan, gulir ke data baru; potong ke koleksi `students` di Firebase Console | "Data baru tersimpan di koleksi students. Listener onSnapshot memperbarui daftar secara realtime."                                                   |
| 33-46 dtk | Tutup aplikasi dari recent apps, buka lagi, home langsung tampil             | "Ketika aplikasi dibuka kembali, Firebase memulihkan sesi lokal dan memeriksa token. Sesi yang masih valid langsung membuka home tanpa login ulang." |
| 46-55 dtk | Tekan Keluar, perlihatkan halaman login                                      | "Tombol keluar menghapus sesi. Implementasi mengikuti materi penyimpanan lokal, Firebase, serta useEffect dengan cleanup listener."                  |

Jika pemilihan akun atau jaringan lambat, potong waktu tunggu pada penyunting video dan beri transisi singkat. Pertahankan urutan kejadian yang sebenarnya. Jangan mempercepat narasi sampai sulit dipahami.

Unggah rekaman selesai ke Google Drive (akses siapa saja dengan link, Viewer) atau YouTube Unlisted. Uji link dari mode incognito, kemudian kumpulkan **link video**, bukan link folder kode. Link video baru tersedia setelah kamu merekam dan mengunggahnya.
