import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Constants from "expo-constants";
import { CampusIcon, GraduationCap } from "../components/AcademicIcons";
import { signInWithGoogle } from "../services/googleSignIn";

export default function LoginScreen() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();
  const wide = width >= 800;
  const expoGo =
    Platform.OS !== "web" && Constants.executionEnvironment === "storeClient";
  async function handleLogin() {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      if (
        ![
          "SIGN_IN_CANCELLED",
          "auth/popup-closed-by-user",
          "auth/cancelled-popup-request",
        ].includes(err.code)
      ) {
        setError(
          `Login gagal. Periksa internet dan konfigurasi Google. ${err.message || ""}`,
        );
      }
    } finally {
      setBusy(false);
    }
  }
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.page}>
      <View style={[styles.header, wide && styles.headerWide]}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <GraduationCap size={28} color="#18312d" />
          </View>
          <Text style={styles.brandName}>KAMPUS / DATA</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Portal akademik</Text>
        </View>
      </View>
      <View style={[styles.main, wide && styles.mainWide]}>
        <View style={[styles.card, wide && styles.cardWide]}>
          <View style={[styles.welcome, wide && styles.welcomeWide]}>
            <View pointerEvents="none" style={styles.pattern}>
              <View style={styles.glow} />
              {Array.from({ length: 18 }, (_, index) => (
                <View
                  key={index}
                  style={[styles.stripe, { left: index * 46 - 150 }]}
                />
              ))}
            </View>
            <View>
              <Text style={styles.eyebrow}>ADMINISTRASI AKADEMIK</Text>
              <Text
                accessibilityRole="header"
                style={[styles.title, wide && styles.titleWide]}
              >
                Selamat datang{"\n"}kembali.
              </Text>
              <Text style={styles.description}>
                Ruang administrasi mahasiswa dalam tampilan yang tenang dan
                sederhana.
              </Text>
            </View>
            <View
              style={[styles.illustration, wide && styles.illustrationWide]}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            >
              <View
                style={[
                  styles.orbit,
                  styles.orbitBack,
                  !wide && styles.orbitSmall,
                ]}
              />
              <View
                style={[
                  styles.orbit,
                  styles.orbitFront,
                  !wide && styles.orbitSmall,
                ]}
              />
              <GraduationCap size={wide ? 224 : 158} />
            </View>
          </View>
          <View style={[styles.signin, wide && styles.signinWide]}>
            <View style={styles.campusIcon}>
              <CampusIcon size={28} />
            </View>
            <Text accessibilityRole="header" style={styles.signinTitle}>
              Masuk ke kampus
            </Text>
            <Text style={styles.signinDescription}>
              Akses dan kelola data mahasiswa dengan akun Google kamu.
            </Text>
            <View style={styles.googlePanel}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Masuk dengan Google"
                accessibilityState={{ disabled: expoGo || busy, busy }}
                disabled={expoGo || busy}
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.googleButton,
                  (pressed || expoGo || busy) && styles.buttonDimmed,
                ]}
              >
                {busy ? (
                  <ActivityIndicator color="#18312d" />
                ) : (
                  <View style={styles.googleIcon}>
                    <Text style={styles.googleLetter}>G</Text>
                  </View>
                )}
                <Text style={styles.googleLabel}>
                  {busy ? "Menghubungkan..." : "Masuk dengan Google"}
                </Text>
              </Pressable>
              <Text style={styles.loginNote}>
                Masuk aman menggunakan akun Google
              </Text>
            </View>
            {expoGo && (
              <Text style={styles.error}>
                Buka aplikasi Data Mahasiswa dari development build untuk masuk
                dengan Google.
              </Text>
            )}
            {!!error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
            <Text style={styles.privacy}>
              Gunakan akun Google untuk melanjutkan. Kamu tidak perlu memasukkan
              kata sandi di aplikasi ini.
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.footer}>Data Mahasiswa · Administrasi akademik</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f6f4ed" },
  page: { flexGrow: 1 },
  header: {
    width: "100%",
    maxWidth: 1152,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  headerWide: { paddingHorizontal: 40, paddingVertical: 28 },
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
  badge: {
    borderWidth: 1,
    borderColor: "#d7dfd3",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: { color: "#52635b", fontSize: 10 },
  main: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  mainWide: { paddingHorizontal: 40, paddingVertical: 32 },
  card: {
    width: "100%",
    maxWidth: 1024,
    alignSelf: "center",
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0px 24px 70px rgba(24, 49, 45, 0.11)",
  },
  cardWide: { flexDirection: "row" },
  welcome: {
    backgroundColor: "#18312d",
    padding: 28,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  welcomeWide: { flex: 1.1, minHeight: 520, padding: 48 },
  pattern: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "rgba(220,234,223,0.045)",
    top: -180,
    right: -120,
  },
  stripe: {
    position: "absolute",
    top: -180,
    width: 1,
    height: 1000,
    backgroundColor: "rgba(255,255,255,0.035)",
    transform: [{ rotate: "25deg" }],
  },
  eyebrow: {
    color: "#dceadf",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 20,
  },
  title: {
    fontFamily: Platform.OS === "android" ? "serif" : "Georgia",
    color: "#fff",
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  titleWide: { fontSize: 49, lineHeight: 56 },
  description: {
    color: "#d1ded6",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 20,
    maxWidth: 340,
  },
  illustration: {
    height: 120,
    marginTop: 22,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  illustrationWide: { height: 182, marginTop: 32 },
  orbit: {
    position: "absolute",
    width: 185,
    height: 185,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  orbitSmall: { width: 132, height: 132 },
  orbitBack: { bottom: -4, right: 50 },
  orbitFront: { bottom: 22, right: 18 },
  signin: { padding: 28, justifyContent: "center" },
  signinWide: { flex: 0.9, padding: 44 },
  campusIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#dceadf",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  signinTitle: {
    fontFamily: Platform.OS === "android" ? "serif" : "Georgia",
    fontSize: 32,
    lineHeight: 39,
    color: "#18312d",
    letterSpacing: -0.5,
  },
  signinDescription: {
    fontSize: 14,
    lineHeight: 23,
    color: "#68766d",
    marginTop: 12,
  },
  googlePanel: {
    marginTop: 32,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dce4d9",
    backgroundColor: "#f8faf7",
    borderRadius: 12,
  },
  googleButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 13,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d7dfd3",
    borderRadius: 8,
  },
  buttonDimmed: { opacity: 0.6 },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dce4d9",
    alignItems: "center",
    justifyContent: "center",
  },
  googleLetter: {
    fontFamily: "sans-serif",
    fontSize: 17,
    fontWeight: "700",
    color: "#4285f4",
    lineHeight: 21,
  },
  googleLabel: {
    fontSize: 13,
    color: "#18312d",
    fontWeight: "600",
    flexShrink: 1,
  },
  loginNote: {
    marginTop: 12,
    color: "#788376",
    fontSize: 10,
    lineHeight: 17,
    textAlign: "center",
  },
  privacy: { marginTop: 26, fontSize: 12, lineHeight: 20, color: "#788376" },
  error: { color: "#a33333", lineHeight: 20, fontSize: 12, marginTop: 16 },
  footer: {
    textAlign: "center",
    color: "#788376",
    fontSize: 11,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
  },
});
