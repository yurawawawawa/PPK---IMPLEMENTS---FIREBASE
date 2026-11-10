import { browserLocalPersistence } from "firebase/auth";

// Dipakai saat preview web; Android/iOS memakai persistence.native.js.
export const persistence = browserLocalPersistence;
