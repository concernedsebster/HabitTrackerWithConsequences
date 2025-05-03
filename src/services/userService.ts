// userService.ts
import { db } from "../firebaseConfig";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

export async function markFreeFailureUsed(userId: string | null) {
  if (!userId) {
    throw new Error("userId is required to mark free failure as used.");
  }
  const userRef = doc(db, "users", userId);
  try {
    await setDoc(userRef, { hasUsedFreeFailure: true }, { merge: true });
    console.log("✅ hasUsedFreeFailure successfully written to Firestore");
  } catch (error) {
    console.error("❌ Error writing hasUsedFreeFailure to Firestore:", error);
  }
}