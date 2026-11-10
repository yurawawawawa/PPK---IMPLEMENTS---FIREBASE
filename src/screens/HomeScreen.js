import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import AppButton from "../components/AppButton";
import { CampusIcon, GraduationCap } from "../components/AcademicIcons";
import { addStudent, subscribeStudents } from "../services/students";
import { observeWrite } from "../services/async";

export default function HomeScreen({ profile, onLogout }) {
  const { width } = useWindowDimensions();
  const wide = width >= 800;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [prodi, setProdi] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [pending, setPending] = useState(false);
  const [fromCache, setFromCache] = useState(true);
  const saveObserver = useRef(null);

  useEffect(
    () => () => {
      saveObserver.current?.();
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setListError(
        "Firebase belum merespons. Periksa koneksi, lalu coba muat ulang.",
      );
    }, 12000);
    const unsubscribe = subscribeStudents(
      (data, metadata) => {
        if (!metadata.fromCache) clearTimeout(timer);
        setStudents(data);
        setFromCache(metadata.fromCache);
        if (!metadata.fromCache) setListError("");
        setLoading(false);
      },
      (err) => {
        clearTimeout(timer);
        setListError(
          `Data gagal dimuat (${err.code}). Periksa koneksi dan Firestore Rules.`,
        );
        setLoading(false);
      },
    );
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [attempt]);

  function handleAdd() {
    if (saveObserver.current) return;
    setSaving(true);
    setFormError("");
    setNotice("");
    try {
      const operation = addStudent({ nama, nim, prodi });
      saveObserver.current = observeWrite(operation, {
        onWaiting() {
          setSaving(false);
          setPending(true);
          setNotice(
            "Data masih menunggu konfirmasi Firebase. Jangan kirim ulang; sinkronisasi akan berlanjut saat koneksi tersedia.",
          );
        },
        onSuccess() {
          saveObserver.current = null;
          setSaving(false);
          setPending(false);
          setNama("");
          setNim("");
          setProdi("");
          setShowForm(false);
          setNotice("Data mahasiswa berhasil disimpan di Firebase.");
          Keyboard.dismiss();
        },
        onError(err) {
          saveObserver.current = null;
          setSaving(false);
          setPending(false);
          setNotice("");
          setFormError(
            `Gagal menyimpan (${err.code || "unknown"}). Periksa koneksi dan Firestore Rules.`,
          );
        },
      });
    } catch (err) {
      setFormError(
        err.code
          ? "Gagal menyimpan. Periksa koneksi dan Firestore Rules."
          : err.message,
      );
      setSaving(false);
    }
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.list, wide && styles.listWide]}
        ListHeaderComponent={
          <>
            <View style={styles.navigation}>
              <View style={styles.brand}>
                <View style={styles.brandIcon}>
                  <GraduationCap size={28} color="#18312d" />
                </View>
                <Text style={styles.brandName}>KAMPUS / DATA</Text>
              </View>
              <AppButton title="Keluar" secondary onPress={onLogout} />
            </View>
            <View style={[styles.hero, wide && styles.heroWide]}>
              <View pointerEvents="none" style={styles.pattern}>
                {Array.from({ length: 28 }, (_, index) => (
                  <View
                    key={index}
                    style={[styles.stripe, { left: index * 46 - 100 }]}
                  />
                ))}
                <View style={styles.glow} />
              </View>
              <View style={styles.heroContent}>
                <Text style={styles.eyebrow}>ADMINISTRASI AKADEMIK</Text>
                <Text
                  accessibilityRole="header"
                  style={[styles.title, wide && styles.titleWide]}
                >
                  Data mahasiswa.
                </Text>
                <Text style={styles.heroDescription}>
                  Satu ruang untuk mencatat dan mengenal mahasiswa kampus.
                </Text>
                <View style={styles.profile}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {profile.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.profileText}>
                    <Text style={styles.name}>Halo, {profile.name}</Text>
                    <Text style={styles.email}>{profile.email}</Text>
                  </View>
                </View>
              </View>
              {wide && (
                <View
                  accessible={false}
                  importantForAccessibility="no-hide-descendants"
                  style={styles.heroArt}
                >
                  <View style={styles.orbit} />
                  <GraduationCap size={180} />
                </View>
              )}
            </View>
            <View style={[styles.toolbar, wide && styles.toolbarWide]}>
              <View>
                <Text style={styles.sectionEyebrow}>DIREKTORI KAMPUS</Text>
                <View style={styles.sectionHeading}>
                  <Text accessibilityRole="header" style={styles.sectionTitle}>
                    Daftar mahasiswa
                  </Text>
                  {!loading && !listError && (
                    <View style={styles.count}>
                      <Text style={styles.countText}>{students.length}</Text>
                    </View>
                  )}
                </View>
              </View>
              <AppButton
                title={showForm ? "Tutup form" : "+ Tambah mahasiswa"}
                onPress={() => setShowForm(!showForm)}
                disabled={saving}
              />
            </View>
            {showForm && (
              <View style={styles.form}>
                <View style={styles.formHeading}>
                  <View style={styles.brandIcon}>
                    <CampusIcon size={24} />
                  </View>
                  <View style={styles.formHeadingText}>
                    <Text style={styles.formTitle}>Tambah mahasiswa</Text>
                    <Text style={styles.formDescription}>
                      Lengkapi identitas mahasiswa di bawah ini.
                    </Text>
                  </View>
                </View>
                <Text style={styles.label}>Nama</Text>
                <TextInput
                  accessibilityLabel="Nama mahasiswa"
                  style={styles.input}
                  placeholder="Nama lengkap"
                  placeholderTextColor="#94a097"
                  selectionColor="#18312d"
                  value={nama}
                  onChangeText={setNama}
                  maxLength={100}
                  editable={!saving && !pending}
                />
                <Text style={styles.label}>NIM</Text>
                <TextInput
                  accessibilityLabel="NIM"
                  style={styles.input}
                  placeholder="Contoh: 24060123120001"
                  placeholderTextColor="#94a097"
                  selectionColor="#18312d"
                  value={nim}
                  onChangeText={setNim}
                  maxLength={20}
                  keyboardType="number-pad"
                  editable={!saving && !pending}
                />
                <Text style={styles.label}>Program studi</Text>
                <TextInput
                  accessibilityLabel="Program studi"
                  style={styles.input}
                  placeholder="Contoh: Informatika"
                  placeholderTextColor="#94a097"
                  selectionColor="#18312d"
                  value={prodi}
                  onChangeText={setProdi}
                  maxLength={100}
                  editable={!saving && !pending}
                />
                <AppButton
                  title={pending ? "Menunggu sinkronisasi" : "Simpan mahasiswa"}
                  onPress={handleAdd}
                  loading={saving}
                  disabled={pending}
                />
                {!!formError && (
                  <Text accessibilityRole="alert" style={styles.error}>
                    {formError}
                  </Text>
                )}
              </View>
            )}
            {!!notice && (
              <Text
                accessibilityLiveRegion="polite"
                style={pending ? styles.waiting : styles.success}
              >
                {notice}
              </Text>
            )}
            <View style={styles.connection}>
              <View
                style={[
                  styles.connectionDot,
                  fromCache && styles.connectionWaiting,
                ]}
              />
              <Text style={styles.caption}>
                {fromCache
                  ? "Menghubungkan ke Firebase · menampilkan data lokal yang tersedia"
                  : "Terhubung ke Cloud Firestore"}
              </Text>
            </View>
            {!!listError && (
              <View style={styles.errorPanel}>
                <Text accessibilityRole="alert" style={styles.error}>
                  {listError}
                </Text>
                <AppButton
                  title="Muat ulang"
                  secondary
                  onPress={() => {
                    setLoading(true);
                    setListError("");
                    setAttempt(attempt + 1);
                  }}
                />
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}>
              <ActivityIndicator color="#18312d" />
              <Text style={styles.emptyText}>Memuat data mahasiswa...</Text>
            </View>
          ) : !listError ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <CampusIcon size={30} />
              </View>
              <Text style={styles.emptyTitle}>
                {fromCache
                  ? "Menunggu data mahasiswa"
                  : "Mulai catatan pertama."}
              </Text>
              <Text style={styles.emptyText}>
                {fromCache
                  ? "Belum ada data dari server. Pastikan koneksi internet aktif."
                  : "Belum ada mahasiswa. Tambahkan data melalui tombol di atas."}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.student}>
            <View style={styles.studentAvatar}>
              <Text style={styles.studentInitial}>
                {String(item.nama || "?")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.studentContent}>
              <Text style={styles.studentName}>{item.nama}</Text>
              <Text style={styles.studentNim}>NIM · {item.nim}</Text>
              <Text style={styles.detail}>{item.prodi}</Text>
              {item.pending && (
                <Text style={styles.pendingLabel}>
                  Menunggu konfirmasi Firebase
                </Text>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.footer}>
            Data Mahasiswa · Administrasi akademik
          </Text>
        }
      />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f4ed" },
  list: {
    width: "100%",
    maxWidth: 1104,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    flexGrow: 1,
  },
  listWide: { paddingHorizontal: 40, paddingTop: 28 },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 32,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 12, flexShrink: 1 },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#dceadf",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    color: "#18312d",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  hero: {
    backgroundColor: "#18312d",
    padding: 28,
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0px 14px 40px rgba(24,49,45,0.10)",
  },
  heroWide: { flexDirection: "row", alignItems: "center", padding: 40 },
  pattern: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
  },
  stripe: {
    position: "absolute",
    top: -180,
    width: 1,
    height: 900,
    backgroundColor: "rgba(255,255,255,0.035)",
    transform: [{ rotate: "25deg" }],
  },
  glow: {
    position: "absolute",
    top: -180,
    right: -80,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(220,234,223,0.04)",
  },
  heroContent: { flex: 1 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "600",
    color: "#dceadf",
    letterSpacing: 2,
    marginBottom: 15,
  },
  title: {
    fontFamily: Platform.OS === "android" ? "serif" : "Georgia",
    fontSize: 36,
    lineHeight: 43,
    color: "#fff",
    letterSpacing: -0.6,
  },
  titleWide: { fontSize: 44, lineHeight: 52 },
  heroDescription: {
    color: "#d1ded6",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 420,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 26,
  },
  profileText: { flex: 1 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(220,234,223,0.13)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#dceadf", fontSize: 12, fontWeight: "600" },
  name: { color: "#fff", fontSize: 13, lineHeight: 20, fontWeight: "500" },
  email: { color: "#b2c5ba", fontSize: 12, lineHeight: 19 },
  heroArt: {
    width: 208,
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 28,
  },
  orbit: {
    position: "absolute",
    right: 18,
    width: 166,
    height: 166,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  toolbar: { gap: 18, marginTop: 32, marginBottom: 22 },
  toolbarWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionEyebrow: {
    fontSize: 9,
    letterSpacing: 1.7,
    fontWeight: "600",
    color: "#788376",
    marginBottom: 8,
  },
  sectionHeading: { flexDirection: "row", alignItems: "center", gap: 12 },
  sectionTitle: {
    fontFamily: Platform.OS === "android" ? "serif" : "Georgia",
    color: "#18312d",
    fontSize: 27,
    lineHeight: 34,
  },
  count: {
    backgroundColor: "#dceadf",
    minWidth: 30,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 9,
  },
  countText: { fontSize: 12, fontWeight: "600", color: "#18312d" },
  form: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dce4d9",
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    gap: 8,
  },
  formHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  formHeadingText: { flex: 1 },
  formTitle: {
    fontFamily: Platform.OS === "android" ? "serif" : "Georgia",
    fontSize: 24,
    color: "#18312d",
    lineHeight: 30,
  },
  formDescription: {
    color: "#788376",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 3,
  },
  label: { fontSize: 12, fontWeight: "600", color: "#52635b" },
  input: {
    borderWidth: 1,
    borderColor: "#d7dfd3",
    borderRadius: 10,
    minHeight: 48,
    padding: 13,
    fontSize: 14,
    color: "#18312d",
    backgroundColor: "#fafbf8",
    marginBottom: 8,
  },
  connection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  connectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#537a5b",
  },
  connectionWaiting: { backgroundColor: "#b78a43" },
  caption: { flex: 1, fontSize: 11, lineHeight: 18, color: "#788376" },
  student: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e5d9",
    borderRadius: 18,
    marginBottom: 12,
  },
  studentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#edf2e9",
    alignItems: "center",
    justifyContent: "center",
  },
  studentInitial: {
    fontFamily: Platform.OS === "android" ? "serif" : "Georgia",
    fontSize: 24,
    color: "#43624b",
  },
  studentContent: { flex: 1 },
  studentName: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#18312d",
    marginBottom: 4,
  },
  studentNim: { color: "#788376", fontSize: 12, lineHeight: 20 },
  detail: { color: "#52635b", fontSize: 13, lineHeight: 22, marginTop: 2 },
  errorPanel: {
    backgroundColor: "#fff4ef",
    borderWidth: 1,
    borderColor: "#eddbd2",
    borderRadius: 16,
    padding: 18,
    gap: 14,
    marginBottom: 18,
  },
  error: { color: "#a33333", fontSize: 12, lineHeight: 20 },
  success: {
    backgroundColor: "#e7efe3",
    color: "#365d40",
    fontSize: 13,
    lineHeight: 21,
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
  },
  waiting: {
    backgroundColor: "#f3ead6",
    color: "#89652c",
    fontSize: 12,
    lineHeight: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
  },
  pendingLabel: {
    color: "#89652c",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 8,
  },
  empty: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e5d9",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#edf2e9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: Platform.OS === "android" ? "serif" : "Georgia",
    color: "#18312d",
    fontSize: 24,
    textAlign: "center",
  },
  emptyText: {
    color: "#788376",
    fontSize: 13,
    lineHeight: 22,
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    color: "#788376",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 32,
    marginBottom: 8,
  },
});
