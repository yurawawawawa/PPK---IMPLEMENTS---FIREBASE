import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { firebaseConfig, missingConfig } from "./environment";
import { persistence } from "./persistence";

let services;
export function getFirebase() {
  if (services) return services;
  if (missingConfig.length)
    throw new Error("Isi konfigurasi pada .env terlebih dahulu.");
  const existing = getApps().some((app) => app.name === "[DEFAULT]");
  const app = existing ? getApp() : initializeApp(firebaseConfig);
  const auth = existing ? getAuth(app) : initializeAuth(app, { persistence });
  const db = existing
    ? getFirestore(app)
    : initializeFirestore(app, {
        experimentalForceLongPolling: true,
        experimentalAutoDetectLongPolling: false,
      });
  services = { auth, db };
  return services;
}
