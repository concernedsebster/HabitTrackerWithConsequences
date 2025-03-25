import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Import service functions
import { 
  fetchUserHabit, 
  saveHabit, 
  updateCommitmentDate, 
  deleteUserHabit
} from "./services/habitService.js";

// Import components
import PhoneAuth from "src/components/auth/PhoneAuth";
import { useFirebaseAuthListener, useFetchHabitData } from "src/hooks/useAuthStatus.js";
import ConfirmationModal from "src/modals/ConfirmationModal.jsx";
import NameStep from "src/components/habitForm/NameStep";
import HabitStep from "src/components/habitForm/HabitStep";
import FrequencyStep from "src/components/habitForm/FrequencyStep";
import CommitmentDateStep from "src/components/habitForm/CommitmentDateStep";
import FailureConsequenceStep from "src/components/habitForm/FailureConsequenceStep";
import SuccessConsequenceStep from "src/components/habitForm/SuccessConsequenceStep";
import ReviewStep from "src/components/habitForm/ReviewStep";
import HabitDisplay from "src/components/habitTracker/HabitDisplay";

function HabitTracker() {
  React.useEffect(() => {
    console.log("✅ Habit tracker successfully loaded!");
  }, []);

  // State declarations
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState("");
  const [habit, setHabit] = React.useState("");
  const [trackingHabit, setTrackingHabit] = React.useState("");
  const [frequency, setFrequency] = React.useState("");
  const [commitmentDate, setCommitmentDate] = React.useState("");
  const [failureConsequence, setFailureConsequence] = React.useState("");
  const [successConsequence, setSuccessConsequence] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditingDate, setIsEditingDate] = React.useState(false);
  const [newCommitmentDate, setNewCommitmentDate] = React.useState("");
  const [hasEditedCommitmentDate, setHasEditedCommitmentDate] = React.useState(false);
  const [isDateEditModalOpen, setIsDateEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

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
          window.recapthcaVerifier = null; // 🚫 Remove reCAPTCHA reference
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

  useFetchHabitData(
    user,
    setStep,
    setName,
    setTrackingHabit,
    setFrequency,
    setCommitmentDate,
    setFailureConsequence,
    setSuccessConsequence,
    setHasEditedCommitmentDate
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
    if (failureConsequence)
      console.log("⚠️ New failure consequence set:", failureConsequence);
  }, [failureConsequence]);

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
        return failureConsequence.trim() !== ""; // Must enter a failure consequence
      case 6: // Success Reward Step
        return successConsequence.trim() !== ""; // Must enter a success reward
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setIsModalOpen(false);
    
    const habitData = {
      name,
      habit,
      trackingHabit: habit, 
      frequency,
      commitmentDate,
      failureConsequence,
      successConsequence,
      hasEditedCommitmentDate: false
    };

    const result = await saveHabit(user?.uid, habitData);
    
    if (result.success) {
      console.log("✅ Habit saved to Firestore:", habit);
      setTrackingHabit(habit);
      setStep(8); // Move user to the habit-tracking homepage
    } else {
      console.error("🚨 Error saving habit:", result.message);
    }
  }
  async function confirmDateEdit() {
    const result = await updateCommitmentDate(user?.uid, newCommitmentDate);
    
    if (result.success) {
      // Update local state
      setCommitmentDate(newCommitmentDate);
      setIsEditingDate(false);
      setHasEditedCommitmentDate(true);
      setIsDateEditModalOpen(false); // Close the modal
    } else {
      console.error("🚨 Error updating commitment date:", result.message);
    }
  }

  async function deleteHabit() {
    const result = await deleteUserHabit(user?.uid);
    
    if (result.success) {
      // Reset state
      setName("");
      setHabit("");
      setTrackingHabit("");
      setFrequency("");
      setCommitmentDate("");
      setFailureConsequence("");
      setSuccessConsequence("");
      setHasEditedCommitmentDate(false);
      setStep(1); // Start from the beginning
    } else {
      console.error("🚨 Error deleting habit:", result.message);
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
      {isAuthenticated ? (
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
              failureConsequence={failureConsequence} 
              setFailureConsequence={setFailureConsequence} 
              onBack={() => setStep(4)} 
              onNext={() => setStep(6)} 
              isValid={isStepValid} 
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
              failureConsequence={failureConsequence}
              successConsequence={successConsequence}
              onBack={() => setStep(6)} 
              onSubmit={() => setIsModalOpen(true)}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen} 
              handleSubmit={handleSubmit}
            />
          )}

          {/* Step 8: Habit Display */}
          {step === 8 && (
            <HabitDisplay 
              name={name}
              trackingHabit={trackingHabit}
              frequency={frequency}
              commitmentDate={commitmentDate}
              failureConsequence={failureConsequence}
              successConsequence={successConsequence}
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
          )}

          
        </>
      ) : (
        <PhoneAuth setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}

export default HabitTracker;
