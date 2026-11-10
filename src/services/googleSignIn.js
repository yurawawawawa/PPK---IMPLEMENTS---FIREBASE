import {
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirebase } from "../config/firebase";

// Preview web memakai Firebase Auth Google yang sebenarnya.
export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  // initializeAuth() hanya diberi persistence; resolver popup web perlu
  // diteruskan secara eksplisit agar Firebase tidak melempar argument-error.
  return signInWithPopup(
    getFirebase().auth,
    provider,
    browserPopupRedirectResolver,
  );
}
export async function signOutGoogle() {}
