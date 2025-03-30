import {useEffect} from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getHabitFromFirestore } from "../services/habitService";

export function useFirebaseAuthListener(
  setUser: (user: any | null) => void, 
  setIsAuthenticated: (auth: boolean) => void
) {
  // This hook monitors the authentication state of the user
  // It sets the user and authentication status in the parent component
  // when the authentication state changes.

  // This effect runs once when the component mounts
  // and sets up a listener for authentication state changes.
  // It cleans up the listener when the component unmounts.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [setUser, setIsAuthenticated]); // Dependencies array
}

// Fetch habit data after authentication
export function useSyncHabitData(
  user: { uid: string } | null, 
  setStep: (step: number) => void,
  setName: (name: string) => void, 
  setTrackingHabit: (value: string) => void,
  setFrequency: (value: string) => void,
  setCommitmentDate: (value: string) => void,
  setFailureConsequence: (value: string) => void,
  setSuccessConsequence: (value: string) => void,
  setHasEditedCommitmentDate: (value: boolean) => void
) {
  // This hook fetches the user's habit data from Firestore after the user is authenticated.
useEffect(() => {
    if (!user) return;
    
    const loadHabitData = async () => {
      const result = await getHabitFromFirestore(user.uid);
      
      if (result.success && result.habitData) {
        const habitData = result.habitData;
        
        // Set retrieved habit data in state
        setName(habitData.name);
        setTrackingHabit(habitData.habit);
        setFrequency(habitData.frequency);
        setCommitmentDate(habitData.commitmentDate);
        setFailureConsequence(habitData.failureConsequence);
        setSuccessConsequence(habitData.successConsequence);
        setHasEditedCommitmentDate(habitData.hasEditedCommitmentDate || false);
        
        setStep(8); // Move user to habit-tracking UI
      }
    };
  
    loadHabitData();
  }, [user]); // ✅ Ensure effect runs only when `user` state updates
}