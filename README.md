# Data Mahasiswa - React Native + Firebase

Aplikasi sederhana untuk tugas Pengembangan Platform Khusus. Target utama **Android**, memakai **Expo SDK 57**, JavaScript, Firebase Authentication Google, AsyncStorage, dan Cloud Firestore. Preview web tersedia untuk mengecek konfigurasi dengan cepat.

**Status:** project Firebase `ppk-firebase-implementation` dan proyek Expo sudah dikonfigurasi. Login web sudah diperlihatkan, tetapi akses Firestore terakhir masih perlu diuji ulang setelah Rules dipublish. APK mandiri menggunakan profil `preview`. Verifikasi login Google, baca/tulis cloud, persistensi sesi di HP, serta rekaman video tetap diperlukan sebelum submission.

## 1. Kesesuaian dengan materi dosen

Materi dibaca dari [folder Drive dosen](https://drive.google.com/drive/folders/1ZWzCEylBvdOL57JeK4rvF0-QHz-eaZPH), termasuk PDF dan dokumentasi kode yang tersedia.

| Materi                                                                           | Penerapan                                                                                                                                |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **09. Pemrograman Bergerak**, bagian Tugas                                       | React Native melalui Expo; tetap di SDK 57 seperti instruksi PDF.                                                                        |
| **10.01 React Native UI Lifecycle**, komponen inti, props, mounting, dan cleanup | `View`, `Text`, `TextInput`, `Pressable`, `FlatList`, `StyleSheet`; komponen `AppButton`; `useState` dan `useEffect` dengan unsubscribe. |
| **10.02 Dokumentasi Code React Native.docx**                                     | Pola functional component, daftar dengan `FlatList`, serta styling dasar.                                                                |
| **11. Manajemen Data Mobile**, Apa itu AsyncStorage?                             | Informasi login disimpan sebagai JSON dengan `AsyncStorage.setItem`. SDK Firebase juga menyimpan sesi/token menggunakan AsyncStorage.    |
| **11. Manajemen Data Mobile**, Cloud BaaS dan Hands-on: Firestore CRUD realtime  | Koleksi `students`, `addDoc`, `serverTimestamp`, `query`, `orderBy`, dan `onSnapshot`.                                                   |
| **11. Manajemen Data Mobile**, Auth & session caching                            | Buka aplikasi -> Firebase membaca sesi lokal -> periksa/refresh token -> home bila valid; login bila tidak ada sesi.                     |

AsyncStorage dipilih karena **dibahas secara eksplisit di PDF** dan cukup untuk tugas sederhana ini. MMKV juga dibahas, tetapi tidak wajib ditambahkan. AsyncStorage tidak terenkripsi; ini implementasi praktikum. Aplikasi tidak menyimpan password atau service-account key.

**Penyesuaian untuk Google Sign-In:** PDF dasar menggunakan Expo Go. Modul login Google native memerlukan **development build**, sehingga fitur login Android tidak bisa diuji di Expo Go. Framework dan pola kode tetap Expo/React Native sesuai materi. Rujukan: [Google authentication Expo](https://docs.expo.dev/guides/google-authentication/) dan [setup library Google Sign-In](https://react-native-google-signin.github.io/docs/setting-up/expo). Tidak menggunakan backend buatan sendiri atau database tambahan.

## 2. Siapkan Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/), buat project baru. Google Analytics tidak diperlukan untuk tugas ini.
2. Di **Project settings -> General -> Your apps**, tambahkan aplikasi **Web** (`</>`). Web app ini dibutuhkan karena kode memakai Firebase JavaScript SDK, termasuk saat berjalan di Android. Hosting tidak perlu diaktifkan.
3. Salin nilai `firebaseConfig` yang diberikan Firebase.
4. Di **Authentication -> Sign-in method**, aktifkan **Google**, pilih support email, lalu simpan.
5. Ambil **Web client ID** pada konfigurasi Google provider / Web SDK configuration. Jika tidak tampil, buka project yang sama di [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials), cari OAuth client bertipe **Web application**. Jangan gunakan Android Client ID sebagai `webClientId`.
6. Jika Google meminta konfigurasi consent screen, isi app name dan support email. Jika aplikasi bertipe External dan masih Testing, tambahkan akun Google yang akan dipakai ke Test users.
7. Di **Firestore Database**, buat database **Standard**, ID **`(default)`**, dengan mode production dan lokasi yang dipilih. Database yang dipakai adalah **Cloud Firestore**, bukan Realtime Database.
8. Buka tab **Rules**, salin seluruh isi `firestore.rules` dari proyek ini, lalu **Publish**. Aturannya membolehkan pengguna login membaca dan menambah mahasiswa dengan field yang valid. Update/delete dari aplikasi tidak dipakai.

Referensi setup: [Firebase JS SDK pada Expo](https://docs.expo.dev/guides/using-firebase/), [Google provider Firebase](https://firebase.google.com/docs/auth/web/google-signin), [Firestore](https://firebase.google.com/docs/firestore/quickstart).

## 3. Isi konfigurasi lokal

Di terminal PowerShell, dari folder proyek:

```powershell
npm install
Copy-Item .env.example .env
```

Edit `.env` dengan nilai dari project Firebase milikmu:

| Variabel                                   | Isi dari Firebase / Google                                      |
| ------------------------------------------ | --------------------------------------------------------------- |
| `EXPO_PUBLIC_FIREBASE_API_KEY`             | `firebaseConfig.apiKey`                                         |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`         | `firebaseConfig.authDomain`                                     |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID`          | `firebaseConfig.projectId`                                      |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`      | `firebaseConfig.storageBucket`                                  |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `firebaseConfig.messagingSenderId`                              |
| `EXPO_PUBLIC_FIREBASE_APP_ID`              | `firebaseConfig.appId` **Web app**                              |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`         | OAuth Client ID tipe **Web application** dari project yang sama |

Tidak ada client secret yang perlu dimasukkan. File `.env` sudah diabaikan Git. Jika konfigurasi kosong, aplikasi menampilkan petunjuk setup. Sesudah mengubah `.env`, hentikan Expo dengan Ctrl+C, lalu jalankan ulang dengan `npm start -- --clear`.

### Cek awal lewat web (opsional)

Di Firebase Authentication -> Settings -> Authorized domains, tambahkan **`localhost`** jika belum ada. Jalankan:

```powershell
npm run web
```

Pilih login Google di browser. Ini memakai Firebase sungguhan, bukan mode demo. Web memakai persistensi browser; pengujian AsyncStorage dan submission aplikasi mobile dilakukan melalui Android.

## 4. Jalankan aplikasi Android

### Pilihan utama: Expo EAS Build tanpa Android Studio

Proyek telah terhubung ke [@aryur/mahasiswa](https://expo.dev/accounts/aryur/projects/mahasiswa). Profil `preview` di `eas.json` menghasilkan **APK mandiri**: kode aplikasi sudah dibundel di APK, sehingga bisa dibuka langsung di HP tanpa scan QR, alamat IP, server Metro, atau laptop. Internet tetap dibutuhkan untuk login Google dan sinkronisasi Firebase. Sertifikat Android dikelola oleh EAS, sehingga Android Studio tidak diperlukan pada jalur ini.

1. Buka Firebase **Project settings -> General -> Your apps -> Add app -> Android**.
2. Daftarkan package name **`com.ppk.mahasiswa`** dan nickname **Data Mahasiswa Android**.
3. Masukkan SHA-1 dari sertifikat EAS untuk proyek ini: **`C6:0C:66:B2:3D:79:5D:6E:14:B5:C9:6A:0C:32:C1:9C:57:38:BB:2E`**. Jika aplikasinya sudah terdaftar, gunakan **Add fingerprint** di pengaturan aplikasi Android tersebut.
4. Unduh `google-services.json` terbaru setelah fingerprint ditambahkan. Letakkan file di root proyek, sejajar `package.json`.
5. Jalankan build cloud dari root proyek:

```powershell
npx eas-cli@latest build --platform android --profile preview
```

6. Setelah build berhasil, buka link hasil build di HP dan instal APK **Data Mahasiswa**, lalu buka aplikasinya langsung. Build baru versi 1.0.1 memakai version code 2. Coba memasangnya sebagai pembaruan aplikasi yang sudah ada agar data login lokal tetap terjaga.

Jika ingin mengembangkan kode dengan Fast Refresh dari laptop, profil `development` tetap tersedia: build dengan `--profile development`, lalu jalankan `npm start`. Pada APK mandiri `preview`, perubahan kode berikutnya memerlukan APK baru.

`.easignore` mengizinkan `.env` dan `google-services.json` ikut dalam paket upload EAS karena berisi konfigurasi client yang dibutuhkan build. Kedua file tetap diabaikan oleh Git. Folder native lokal `android/` tidak diunggah; EAS membuatnya dari konfigurasi Expo. SHA-1 pada jalur ini adalah SHA-1 EAS di atas, bukan SHA-1 debug keystore lokal. Jika sertifikat EAS diganti, fingerprint di Firebase juga harus diperbarui.

### Alternatif: build lokal dengan Android Studio

Untuk alur lokal ini, pasang Android Studio beserta Android SDK yang diminta Expo, atur `ANDROID_HOME`/PATH sesuai [setup Android Expo](https://docs.expo.dev/get-started/set-up-your-environment/), dan gunakan versi JDK yang disyaratkan Expo SDK 57. Gunakan HP Android dengan Google Play Services, USB debugging aktif, atau emulator berimage **Google Play**. Pastikan perangkat terlihat oleh `adb devices`.

Jika PowerShell menampilkan `Default install location not found` atau `'adb' is not recognized`, Android SDK belum terpasang atau belum masuk PATH. Di Android Studio buka **More Actions → SDK Manager**, install **Android SDK Platform-Tools**, **Android SDK Build-Tools**, dan satu **Android SDK Platform**. Catat **Android SDK Location**. Biasanya lokasinya `C:\Users\<nama-user>\AppData\Local\Android\Sdk`. Tutup semua PowerShell, buka yang baru, lalu set environment variable sesuai lokasi tersebut (ganti path jika Android Studio menunjukkan lokasi berbeda):

```powershell
$androidSdk = "$env:LOCALAPPDATA\Android\Sdk"
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdk, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $androidSdk, "User")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$newEntries = @("$androidSdk\platform-tools", "$androidSdk\emulator", "$androidSdk\cmdline-tools\latest\bin")
$mergedPath = (($userPath -split ';') + $newEntries | Where-Object { $_ } | Select-Object -Unique) -join ';'
[Environment]::SetEnvironmentVariable("Path", $mergedPath, "User")
```

Buka PowerShell baru dan cek `adb version`. Jalankan perintah Expo satu per satu; jangan menempelkan dua perintah dalam satu baris:

```powershell
npx expo prebuild --platform android
npm run android
```

### A. Buat project native dan dapatkan SHA-1 debug

```powershell
npx expo prebuild --platform android
keytool -list -v -alias androiddebugkey -keystore ./android/app/debug.keystore -storepass android -keypass android
```

Perintah pertama menghasilkan folder native dan debug keystore. Catat fingerprint **SHA1** dari perintah kedua. Jangan membagikan keystore atau mengubahnya setelah mendaftarkan fingerprint.

### B. Daftarkan aplikasi Android di Firebase

1. Di Firebase Project settings -> Your apps, tambahkan aplikasi **Android**.
2. Isi package name tepat **`com.ppk.mahasiswa`**, sesuai `app.config.js`.
3. Masukkan SHA-1 dari debug keystore tadi. SHA-256 juga boleh didaftarkan.
4. Unduh **`google-services.json`** terbaru. Letakkan di **root proyek**, sejajar `package.json`.
5. Jika file sudah diunduh sebelum Google provider/SHA-1 diaktifkan, unduh kembali setelah keduanya selesai.
6. Pastikan `.env` tetap memakai Web app ID dan Google **Web** Client ID dari project yang sama.

### C. Build dan pasang ke HP/emulator

```powershell
npx expo prebuild --platform android
npm run android
```

Prebuild kedua menerapkan file Google yang baru. Tidak perlu mengedit Gradle secara manual. Saat ada beberapa perangkat, gunakan `npm run android -- --device`.

Setelah development build terpasang, penggunaan berikutnya cukup:

```powershell
npm start
```

Buka aplikasi **Data Mahasiswa** yang sudah dipasang. HP dan laptop harus bisa mengakses server Metro (misalnya Wi-Fi yang sama). Ini development build milik aplikasi ini, bukan Expo Go. Jika modul native atau konfigurasi Android berubah, build ulang dengan `npm run android`.

Untuk menghasilkan APK mandiri agar rekaman tidak bergantung pada Metro, konfigurasi EAS opsional sudah ada di `eas.json` (profil `preview`). Jalur build lokal di atas sudah cukup untuk mengerjakan tugas; pastikan SHA-1 yang didaftarkan selalu cocok dengan sertifikat APK yang dipakai, termasuk jika nantinya memakai EAS.

## 5. Data mahasiswa

Pada home, tekan **+ Tambah mahasiswa**, isi form, lalu **Simpan mahasiswa**. Koleksi `students` otomatis dibuat saat data pertama berhasil disimpan.

| Field       | Tipe Firestore | Contoh                                    |
| ----------- | -------------- | ----------------------------------------- |
| `nama`      | string         | Alya Putri                                |
| `nim`       | string         | 24060123120001                            |
| `prodi`     | string         | Informatika                               |
| `createdAt` | timestamp      | Diisi otomatis dengan `serverTimestamp()` |

Contoh lain: Bima Pratama / 24060123120002 / Informatika; Citra Lestari / 24060123120003 / Sistem Informasi. Ini data fiktif untuk praktikum.

Boleh input dari **Firebase Console** juga. Buat document Auto-ID pada `students` dengan **semua field** di atas, termasuk `createdAt` bertipe timestamp. Query mengurutkan berdasarkan `createdAt`, jadi document tanpa field itu tidak muncul. NIM wajib disimpan sebagai **string**, bukan number.

## 6. Cara kerja yang perlu dipahami

- **Login:** pilih akun Google -> dapat ID token Google -> `GoogleAuthProvider.credential()` -> `signInWithCredential()` di Firebase. Yang dipakai untuk sesi adalah user Firebase.
- **Storage lokal:** `getReactNativePersistence(AsyncStorage)` menyimpan sesi Firebase termasuk token/refresh token. `restoreSession()` menyimpan profil `{ uid, name, email, expiresAt }` sebagai JSON pada key `@mahasiswa/loginInfo`. Tidak perlu menggandakan token secara manual atau login memakai profil cache.
- **Bypass:** saat aplikasi dibuka, tunggu callback `onAuthStateChanged`. Sesi tersimpan dipulihkan SDK. `getIdTokenResult()` memakai token Firebase yang masih aktif dan memperbaruinya saat diperlukan. Cache profil saja tidak membuka home. Pemeriksaan yang tidak selesai dalam 12 detik menampilkan Coba lagi. Penolakan sesi oleh Firebase akan mengharuskan login ulang.
- **Status sinkronisasi:** daftar bisa menerima perubahan lokal sebelum server mengonfirmasi write. Baris seperti itu ditandai **Menunggu konfirmasi Firebase**. Setelah 10 detik, spinner simpan diganti status menunggu sinkronisasi dan pengiriman ulang dinonaktifkan untuk menghindari duplikat. Form baru dibersihkan dan sukses ditampilkan setelah server mengonfirmasi; antrean tetap diproses jika koneksi pulih. Firestore memakai long polling untuk kompatibilitas koneksi streaming pada perangkat/jaringan ini. Setelah perubahan konfigurasi koneksi, reload penuh aplikasi agar instance Firestore dibuat ulang.
- **Database:** `addDoc` mengirim mahasiswa ke Firestore. `onSnapshot` memperbarui `FlatList` saat data berubah; fungsi unsubscribe dikembalikan dari `useEffect` untuk cleanup.
- **Keluar:** `signOut` Firebase menghapus sesi persisten, informasi profil lokal dihapus, dan sesi Google native dikeluarkan. Data mahasiswa di cloud tetap tersedia saat login berikutnya.

Rujukan persistensi: [Firebase Auth API](https://firebase.google.com/docs/reference/js/auth#getreactnativepersistence).

## 7. Uji sebelum merekam

1. Instal/buka aplikasi saat belum login: halaman login muncul.
2. Login Google; periksa email profil dan user baru di Firebase Authentication -> Users.
3. Tambahkan mahasiswa; lihat document di Firestore dan baris baru pada home.
4. Ubah data mahasiswa dari Firebase Console; daftar di aplikasi ikut berubah.
5. Tutup aplikasi dari recent apps **tanpa menekan Keluar**, lalu buka lagi: setelah cek sesi, home muncul tanpa memilih akun ulang. Jangan hapus app data/uninstall karena itu menghapus storage.
6. Tekan Keluar, tutup dan buka aplikasi lagi: halaman login kembali.
7. Coba login batal, form kosong, NIM salah, serta buka ulang tanpa internet. Pastikan muncul respons yang sesuai dan tombol Coba lagi berfungsi setelah internet aktif.

Pemeriksaan kode yang tersedia:

```powershell
npm test
npm run lint
npm run typecheck
npm run check:packages
npm run check:bundle
```

Tes lokal memeriksa keputusan sesi, cache profil, token kedaluwarsa, respons jaringan gagal, logout, dan validasi input. Bundling memeriksa Android/web. Pemeriksaan ini tidak menggantikan login Google di perangkat dan koneksi Firebase asli.

## 8. Video submission

Ikuti **`VIDEO-55-DETIK.md`** untuk narasi dan urutan rekaman maksimal 1 menit. Tunjukkan login Google, daftar dari Firestore, penyimpanan data, buka ulang tanpa login, dan logout. Setelah merekam, unggah video dan kumpulkan link yang dapat dibuka dosen. Pastikan durasi hasil akhir kurang dari 60 detik.

## 9. Jika menemui error

| Gejala                              | Yang diperiksa                                                                                                                                                             |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Konfigurasi Firebase belum diisi    | Nama file harus `.env`, bukan `.env.txt`; isi semua variabel, lalu restart Expo.                                                                                           |
| `DEVELOPER_ERROR` / code 10         | Package harus `com.ppk.mahasiswa`, SHA-1 harus milik APK yang terpasang, gunakan Web Client ID dari project yang sama, unduh ulang `google-services.json` dan build ulang. |
| Modul Google native tidak ditemukan | Pakai development build; build ulang sesudah memasang dependensi. Expo Go tidak menyediakan modul ini.                                                                     |
| Google access denied                | Google provider sudah aktif, support email/consent screen benar, akun terdaftar sebagai Test user bila masih Testing.                                                      |
| `auth/unauthorized-domain` pada web | Tambahkan `localhost` di Authorized domains Firebase Auth.                                                                                                                 |
| Missing or insufficient permissions | Login harus berhasil, Firestore Rules sudah dipublish, nama koleksi tepat `students`.                                                                                      |
| Data Console tidak muncul           | Semua dokumen harus mempunyai `createdAt` bertipe timestamp.                                                                                                               |
| Sesi belum dapat diperiksa          | Aktifkan internet lalu Coba lagi. Bila sudah tidak valid, pilih Kembali ke login.                                                                                          |
| HP tidak menerima Metro             | Wi-Fi/firewall harus mengizinkan akses ke laptop; cek perangkat dengan `adb devices`.                                                                                      |

File utama: `App.js` (pemilihan layar), `src/screens/` (login/home), `src/services/` (Google, sesi, data), `src/config/` (Firebase dan persistensi), dan `firestore.rules` (aturan data).
