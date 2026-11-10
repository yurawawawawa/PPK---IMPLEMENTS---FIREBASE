import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebase } from "../config/firebase";
import { validateStudent } from "./validation";

export function addStudent(input) {
  const student = validateStudent(input);
  return addDoc(collection(getFirebase().db, "students"), {
    ...student,
    createdAt: serverTimestamp(),
  });
}
export function subscribeStudents(onData, onError) {
  const q = query(
    collection(getFirebase().db, "students"),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      onData(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          pending: doc.metadata.hasPendingWrites,
        })),
        { fromCache: snapshot.metadata.fromCache },
      );
    },
    onError,
  );
}
