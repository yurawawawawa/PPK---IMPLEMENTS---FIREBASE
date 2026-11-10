import type { Persistence, ReactNativeAsyncStorage } from "firebase/auth";

// Firebase 13 mengekspos fungsi ini pada runtime React Native, tetapi entry
// deklarasi generiknya memakai tipe browser. Signature sesuai SDK terpasang.
declare module "firebase/auth" {
  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage,
  ): Persistence;
}
