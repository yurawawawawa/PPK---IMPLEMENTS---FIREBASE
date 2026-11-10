import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth";

// SDK menyimpan dan memperbarui token sesi ke storage lokal.
export const persistence = getReactNativePersistence(AsyncStorage);
