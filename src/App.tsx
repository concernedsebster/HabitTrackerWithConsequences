import React from "react";
import { NewHabitPayload } from "src/types";
import { signOut, User } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { Routes, Route } from "react-router-dom";

// Import service functions
import { 
  getHabitFromFirestore, 
  saveHabit, 
  updateCommitmentDate, 
  deleteUserHabit
} from "src/services/habitService";

// Import components
import PhoneAuth from "src/components/auth/PhoneAuth";
import { useFirebaseAuthListener, useSyncHabitData } from "src/hooks/useAuthStatus.js";
import NameStep from "src/components/habit/NameStep";
import HabitStep from "src/components/habit/HabitStep";
import FrequencyStep from "src/components/habit/FrequencyStep";
import CommitmentDateStep from "src/components/habit/CommitmentDateStep";
import FailureConsequenceStep from "src/components/habit/FailureConsequenceStep";
import SuccessConsequenceStep from "src/components/habit/SuccessConsequenceStep";
import ReviewStep from "src/components/habit/ReviewStep";
import HabitDisplay from "src/components/tracker/HabitDisplay";
import { serverTimestamp } from "firebase/firestore";
import { AccountabilityPartnerPage } from "src/AccountabilityPartnerPage"
import HabitCheckIn from "src/components/habit/HabitCheckIn";

function HabitTracker() {
  React.useEffect(() => {
    console.log("✅ Habit tracker successfully loaded!");
  }, []);

  // State declarations
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<number>(1);
  const [name, setName] = React.useState<string>("");
  const [habit, setHabit] = React.useState<string>("");
  const [isFetchingHabit, setIsFetchingHabit] = React.useState<boolean>(false);
  const [isSavingHabit, setIsSavingHabit] = React.useState<boolean>(false);
  const [trackingHabit, setTrackingHabit] = React.useState<string>("");
  const [frequency, setFrequency] = React.useState<string>("");
  const [commitmentDate, setCommitmentDate] = React.useState<string>("");
  const [failureConsequenceType, setFailureConsequenceType] = React.useState<"partner" | "app" | null>(null);
  const [partnerPhone, setPartnerPhone] = React.useState<string>("");
  const [isInviteSent, setIsInviteSent] = React.useState<boolean>(false);
  const [hasClickedTextButton, setHasClickedTextButton] = React.useState<boolean>(false);
  const [penaltyAmount, setPenaltyAmount] = React.useState<number | null | "">(null);
  const [successConsequence, setSuccessConsequence] = React.useState<string>("");
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isEditingDate, setIsEditingDate] = React.useState<boolean>(false);
  const [isDateUpdatePending, setIsDateUpdatePending] = React.useState<boolean>(false);
  const [newCommitmentDate, setNewCommitmentDate] = React.useState<string>("");
  const [hasEditedCommitmentDate, setHasEditedCommitmentDate] = React.useState<boolean>(false);
  const [isDateEditModalOpen, setIsDateEditModalOpen] = React.useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);
  const [isDeletingHabit, setIsDeletingHabit] = React.useState<boolean>(false);
  const [partnerIsVerified, setPartnerIsVerified] = React.useState<boolean | null>(null);
  const [hasFailedBefore, setHasFailedBefore] = React.useState<boolean>(false);

  const frequencyOptions = [
    "Everyday",
    "Every 2 days",
    "Every 3 days",
    "3 days a week",
  ];

  function logOut() {
    signOut(auth)
      .then(() => {
        console.log("✅ User logged out successfully!");

        // Reset reCAPTCHA
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear(); // 🗑️ Clear reCAPTCHA
          window.recaptchaVerifier = null; // 🚫 Remove reCAPTCHA reference
        }

        setIsAuthenticated(false);
        setUser(null);
      })
      .catch((error) => {
        console.error("🚨 Error logging out:", error);
      });
  }
  // Log user state changes
  useFirebaseAuthListener(setUser, setIsAuthenticated); // Custom hook to monitor auth state

  useSyncHabitData(
    user,
    setStep,
    setName,
    setHabit,
    setTrackingHabit,
    setFrequency,
    setCommitmentDate,
    setFailureConsequenceType,
    setPartnerIsVerified,
    setSuccessConsequence,
    setHasEditedCommitmentDate,
    setIsFetchingHabit,
    setPartnerPhone,
    setPenaltyAmount,
    setHasFailedBefore,
  ); // Custom hook to fetch habit data

  // Debug logging
  React.useEffect(() => {
    if (habit) console.log("🥅 New habit set:", habit);
  }, [habit]);

  React.useEffect(() => {
    if (trackingHabit)
      console.log("📝 New habit is being tracked:", trackingHabit);
  }, [trackingHabit]);

  React.useEffect(() => {
    if (frequency) console.log("📅 New frequency set:", frequency);
  }, [frequency]);

  React.useEffect(() => {
    if (commitmentDate)
      console.log("📅 New commitment date set:", commitmentDate);
  }, [commitmentDate]);

  React.useEffect(() => {
    if (failureConsequenceType)
      console.log("⚠️ New failure consequence set:", failureConsequenceType);
  }, [failureConsequenceType]);

  React.useEffect(() => {
    if (successConsequence)
      console.log("🏆 New success reward set:", successConsequence);
  }, [successConsequence]);

  React.useEffect(() => {
    if (habit || trackingHabit || frequency)
      console.log(
        "🔄 State changed! Habit:",
        habit,
        "Tracking habit:",
        trackingHabit,
        "Frequency:",
        frequency,
      );
  }, [habit, trackingHabit, frequency]);

  function isStepValid() {
    switch (step) {
      case 1: // Name Step
        return name.trim() !== ""; // Name must not be empty
      case 2: // Habit Step
        return habit.trim() !== ""; // Habit must not be empty
      case 3: // Frequency Step
        return frequency.trim() !== ""; // Frequency must be selected
      case 4: // Commitment Date Step
        return commitmentDate.trim() !== ""; // Date must be selected
      case 5: // Failure Consequence Step
        return failureConsequenceType === 'partner' || failureConsequenceType === 'app'; // Must select a failure consequence type
      case 6: // Success Reward Step
        return successConsequence.trim() !== ""; // Must enter a success reward
      default:
        return false;
    }
  }

  function validateFailureConsequence() {
    if (failureConsequenceType === 'partner') {
      return typeof penaltyAmount === 'number' && penaltyAmount > 0  && partnerPhone.trim().length > 9 && isInviteSent;
    }
    if (failureConsequenceType === 'app') {
      return typeof penaltyAmount === 'number' && penaltyAmount > 50;  
    }
    return false;
  }

  async function handleSubmit() {
    setIsSavingHabit(true);
    try {
      setIsModalOpen(false);
      

    const habitData: NewHabitPayload = {
      name,
      habit,
      frequency,
      commitmentDate,
      failureConsequenceType: failureConsequenceType as "partner" | "app",
      successConsequence,
      hasEditedCommitmentDate: false,
      hasFailedBefore: false,
      penaltyAmount: penaltyAmount as number,
      partnerIsVerified: partnerIsVerified ?? false,
    };

    const result = await saveHabit(user?.uid ?? null, habitData);
    
    if (result.success) {
      console.log("✅ Habit saved to Firestore:", habit);
      setTrackingHabit(habit);
      setStep(8); // Move user to the habit-tracking homepage
    }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("🚨 Error saving habit:", error.message);
      }
    }
    finally {
      setIsSavingHabit(false);
    }
  }
  async function confirmDateEdit() {
    setIsDateUpdatePending(true)
    try {
    const result = await updateCommitmentDate(user?.uid ?? null, newCommitmentDate);
    
    if (result.success) {
      // Update local state
      setCommitmentDate(newCommitmentDate);
      setIsEditingDate(false);
      setHasEditedCommitmentDate(true);
      setIsDateEditModalOpen(false); // Close the modal
    }} catch (error: unknown) {
      if (error instanceof Error) {
        console.error("🚨 Error updating commitment date:", error.message)
      }
    }  finally {
      setIsDateUpdatePending(false)
    }
  }

  async function deleteHabit() {
  setIsDeletingHabit(true);

  try {
    const userId = user?.uid ?? null;
    if (!userId) {
      console.error("No user found! Unable to delete habit.");
      return;
    }

    const docRef = doc(db, "habits", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
      console.log("🗑️ Habit deleted successfully");

      // Reset state
      setName("");
      setHabit("");
      setTrackingHabit("");
      setFrequency("");
      setCommitmentDate("");
      setFailureConsequenceType(null);
      setSuccessConsequence("");
      setHasEditedCommitmentDate(false);
      setStep(1); // Start from the beginning
    } else {
      console.warn("⚠️ No habit found to delete!");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("🚨 Error deleting habit:", error.message);
    }
  } finally {
    setIsDeletingHabit(false);
  }
}

  function handleEditDateClick() {
    if (hasEditedCommitmentDate) {
      console.log("🚨 You can only edit the commitment date once.");
      return
    }
    setIsEditingDate(true);
    setNewCommitmentDate(commitmentDate); // Initialize with current commitment date
  }
  
  function cancelDateEdit() {
    setIsEditingDate(false);
    setIsDateEditModalOpen(false);
    setNewCommitmentDate(""); // Clear the new commitment date
    setHasEditedCommitmentDate(false); // Reset the edited date flag
    console.log("🚨 Date edit cancelled.");
  }

  return (
    <div>
      <Routes>
        <Route path="/accountability" element={<AccountabilityPartnerPage />} />
        <Route path ="*" element={
      isAuthenticated ? (
        <>
          <h1>✨One Habit✨</h1>
          <button onClick={logOut}>Log Out</button>

          {/* Step 1: Enter Name */}
          {step === 1 && (
            <NameStep  
              name={name} 
              setName={setName} 
              onNext={() => setStep(2)} 
              isValid={isStepValid} 
            />
          )}

          {/* Step 2: Enter Habit */}
          {step === 2 && (
            <HabitStep 
              habit={habit} 
              setHabit={setHabit} 
              onBack={() => setStep(1)} 
              onNext={() => setStep(3)} 
              isValid={isStepValid} 
            />
          )}

          {/* Step 3: Frequency */}
          {step === 3 && (
            <FrequencyStep 
              frequency={frequency} 
              setFrequency={setFrequency} 
              frequencyOptions={frequencyOptions}
              onBack={() => setStep(2)} 
              onNext={() => setStep(4)} 
              isValid={isStepValid} 
            />
          )}

          {/* Step 4: Commitment Date */}
          {step === 4 && (
            <CommitmentDateStep 
              commitmentDate={commitmentDate} 
              setCommitmentDate={setCommitmentDate} 
              onBack={() => setStep(3)} 
              onNext={() => setStep(5)} 
              isValid={isStepValid} 
            />
          )}

          {/* Step 5: Failure Consequence */}
          {step === 5 && (
            <FailureConsequenceStep 
              failureConsequenceType={failureConsequenceType} 
              setFailureConsequenceType={setFailureConsequenceType}
              penaltyAmount={penaltyAmount ?? null}
              setPenaltyAmount={setPenaltyAmount}
              hasClickedTextButton={hasClickedTextButton}
              setHasClickedTextButton={setHasClickedTextButton}
              isInviteSent={isInviteSent}
              setIsInviteSent={setIsInviteSent} 
              name={name}
              onBack={() => setStep(4)}
              onNext={() => setStep(6)}  
              isValid={validateFailureConsequence} 
            />
          )}

          {/* Step 6: Success Consequence */}
          {step === 6 && (
            <SuccessConsequenceStep 
              successConsequence={successConsequence} 
              setSuccessConsequence={setSuccessConsequence} 
              onBack={() => setStep(5)} 
              onNext={() => setStep(7)} 
              isValid={isStepValid} 
            />
          )}

          {/* Step 7: Review */}
          {step === 7 && (
            <ReviewStep 
              name={name}
              habit={habit}
              frequency={frequency}
              commitmentDate={commitmentDate}
              successConsequence={successConsequence}
              onBack={() => setStep(6)} 
              onSubmit={() => setIsModalOpen(true)}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen} 
              handleSubmit={handleSubmit}
              isSavingHabit={isSavingHabit}
              failureConsequenceType={failureConsequenceType}
              partnerPhone={partnerPhone}
              penaltyAmount={penaltyAmount}
            />
          )}

          {/* Step 8: Habit Display */}
          {step === 8 && (
            isFetchingHabit ? (
              <p>Loading habit...</p>
            ) : (
            <>
            <HabitDisplay 
              name={name}
              habit={habit}
              trackingHabit={trackingHabit}
              frequency={frequency}
              commitmentDate={commitmentDate}
              successConsequence={successConsequence}
              failureConsequenceType={failureConsequenceType}
              partnerIsVerified={partnerIsVerified}
              penaltyAmount={penaltyAmount}
              isDeleteModalOpen={isDeleteModalOpen}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              deleteHabit={deleteHabit}
              hasEditedCommitmentDate={hasEditedCommitmentDate}
              handleEditDateClick={handleEditDateClick}
              isEditingDate={isEditingDate}
              newCommitmentDate={newCommitmentDate}
              setNewCommitmentDate={setNewCommitmentDate}
              isDateEditModalOpen={isDateEditModalOpen}
              setIsDateEditModalOpen={setIsDateEditModalOpen}
              confirmDateEdit={confirmDateEdit}
              cancelDateEdit={cancelDateEdit}
              logOut={logOut}
            />
            {habit && <HabitCheckIn 
            userId={user?.uid ?? null}
            habit={habit}
            deleteHabit={deleteHabit}
            successConsequence={successConsequence}
            penaltyAmount={penaltyAmount}
            failureConsequenceType={failureConsequenceType}
            partnerIsVerified={partnerIsVerified}
            hasFailedBefore={hasFailedBefore}

            
            />}
            </>
          )
          )}

          
        </>
      ) : (
        <PhoneAuth 
          setIsAuthenticated={setIsAuthenticated} 
          mode="login" 
          userId={user?.uid ?? null} 
        />
      )}
      />
      </Routes>
    </div>
  );
}

export default HabitTracker;
