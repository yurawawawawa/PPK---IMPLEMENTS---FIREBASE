import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirebase } from "../config/firebase";
import { googleWebClientId } from "../config/environment";

let configured = false;
export async function signInWithGoogle() {
  // Lazy import: halaman petunjuk masih bisa dibuka tanpa modul native.
  const { GoogleSignin, isSuccessResponse } = await import(
    "@react-native-google-signin/google-signin"
  );
  if (!configured) {
    GoogleSignin.configure({ webClientId: googleWebClientId });
    configured = true;
  }
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) return;
  const idToken = response.data.idToken;
  if (!idToken)
    throw new Error(
      "ID token Google kosong. Periksa Web Client ID dan SHA-1 Android.",
    );
  return signInWithCredential(
    getFirebase().auth,
    GoogleAuthProvider.credential(idToken),
  );
}
export async function signOutGoogle() {
  // Sesi Google native dapat tersisa dari proses aplikasi sebelumnya.
  const { GoogleSignin } = await import(
    "@react-native-google-signin/google-signin"
  );
  await GoogleSignin.signOut();
}
