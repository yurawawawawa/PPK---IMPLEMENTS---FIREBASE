import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirebase } from "./src/config/firebase";
import { missingConfig } from "./src/config/environment";
import {
  restoreSession,
  clearLoginInfo,
  isInvalidSession,
} from "./src/services/session";
import { signOutGoogle } from "./src/services/googleSignIn";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AppButton from "./src/components/AppButton";

function Main() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (missingConfig.length) return;
    const { auth } = getFirebase();
    let active = true;
    let version = 0;
    const startupTimer = setTimeout(() => {
      if (!active) return;
      version += 1;
      setError(
        "Sesi belum dapat dimuat. Periksa koneksi, lalu tekan Coba lagi.",
      );
      setLoading(false);
    }, 12000);
    // Firebase memulihkan sesi dari AsyncStorage sebelum callback pertama.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(startupTimer);
      const current = ++version;
      setLoading(true);
      try {
        const savedProfile = await restoreSession(user, AsyncStorage);
        if (active && current === version) {
          setProfile(savedProfile);
          setError("");
        }
      } catch (err) {
        if (!active || current !== version) return;
        if (isInvalidSession(err)) {
          try {
            await signOut(auth);
          } catch {
            setProfile(null);
            setError("Sesi tidak valid. Tekan Kembali ke login untuk keluar.");
          }
        } else {
          setProfile(null);
          setError(
            "Sesi belum dapat diperiksa. Pastikan internet aktif, lalu coba lagi.",
          );
        }
      } finally {
        if (active && current === version) setLoading(false);
      }
    });
    return () => {
      active = false;
      clearTimeout(startupTimer);
      unsubscribe();
    };
  }, [attempt]);

  async function handleLogout() {
    try {
      await signOut(getFirebase().auth);
      await clearLoginInfo(AsyncStorage);
      await signOutGoogle();
    } catch {
      Alert.alert(
        "Keluar",
        "Ada proses keluar yang belum selesai. Coba lagi bila diperlukan.",
      );
    }
  }

  if (missingConfig.length)
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Data Mahasiswa</Text>
        <Text style={styles.message}>Konfigurasi Firebase belum diisi.</Text>
        <Text style={styles.message}>
          Salin .env.example menjadi .env dan ikuti README.md, lalu restart
          Expo.
        </Text>
        <Text style={styles.fields}>{missingConfig.join("\n")}</Text>
      </View>
    );
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.message}>Memeriksa sesi login...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{error}</Text>
        <AppButton
          title="Coba lagi"
          onPress={() => {
            setLoading(true);
            setError("");
            setAttempt(attempt + 1);
          }}
        />
        <AppButton title="Kembali ke login" secondary onPress={handleLogout} />
      </View>
    );

  // Home hanya dipasang setelah sesi Firebase valid, bukan karena cache profil ada.
  return profile ? (
    <HomeScreen profile={profile} onLogout={handleLogout} />
  ) : (
    <LoginScreen />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Main />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  center: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 14,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#172554" },
  message: { fontSize: 15, lineHeight: 23, color: "#475569" },
  fields: { fontSize: 12, lineHeight: 20, color: "#475569" },
});
