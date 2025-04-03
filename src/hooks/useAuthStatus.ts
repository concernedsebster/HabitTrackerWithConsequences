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
user: { uid: string; } | null, setStep: (step: number) => void, setName: (name: string) => void, setHabit: (value: string) => void, setTrackingHabit: (value: string) => void, setFrequency: (value: string) => void, setCommitmentDate: (value: string) => void, setFailureConsequenceType: (value: 'partner' | 'app' | null) => void, setSuccessConsequence: (value: string) => void, setHasEditedCommitmentDate: (value: boolean) => void, setIsFetchingHabit: (value: boolean) => void, setPartnerPhone: (value: string) => void, setPenaltyAmount: (value: number | null) => void) {
  // This hook fetches the user's habit data from Firestore after the user is authenticated.
useEffect(() => {
    if (!user) return;
    
    const loadHabitData = async () => {
      setIsFetchingHabit(true);
      try {
      const result = await getHabitFromFirestore(user.uid);
      
      if (result.success && result.habitData) {
        const habitData = result.habitData;
        
        // Set retrieved habit data in state
        setName(habitData.name);
        setHabit(habitData.habit);
        setTrackingHabit(habitData.habit);
        setFrequency(habitData.frequency);
        setCommitmentDate(habitData.commitmentDate);
        setFailureConsequenceType(habitData.failureConsequenceType);
        setSuccessConsequence(habitData.successConsequence);
        setHasEditedCommitmentDate(habitData.hasEditedCommitmentDate || false);
        
        setStep(8); // Move user to habit-tracking UI
      } else {
        // 🧼 clear all relevant state to show onboarding again
        setName('');
        setHabit('');
        setFrequency('');
        setCommitmentDate('');
        setSuccessConsequence('');
        setFailureConsequenceType(null);
        setPenaltyAmount(null);
        setPartnerPhone('');
        setHasEditedCommitmentDate(false);
        setStep(1); // back to start
      }
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error("🚨 Error fetching habit:", error);
      }
    }
    finally {
      setIsFetchingHabit(false);
    }
    };
    loadHabitData();
  }, [user]); // ✅ Ensure effect runs only when `user` state updates
}