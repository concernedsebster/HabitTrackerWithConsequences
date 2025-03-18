// HabitTracker.js (main component)
import React from "react";
import PhoneAuth from "./PhoneAuth";
import { signOut } from "firebase/auth";
import { db } from "../firebaseConfig";
import { collection, addDoc, where, getDocs, getDoc, query, orderBy, limit, serverTimestamp, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Import our new components
import ConfirmationModal from "./components/modals/ConfirmationModal";
import DeleteHabitModal from "./components/modals/DeleteHabitModal";
import DateEditModal from "./components/modals/DateEditModal";
import NameStep from "./components/habitForm/NameStep";
import HabitStep from "./components/habitForm/HabitStep";
import FrequencyStep from "./components/habitForm/FrequencyStep";
import CommitmentDateStep from "./components/habitForm/CommitmentDateStep";
import FailureConsequenceStep from "./components/habitForm/FailureConsequenceStep";
import SuccessConsequenceStep from "./components/habitForm/SuccessRewardStep";
import ReviewStep from "./components/habitForm/ReviewStep";
import HabitDisplay from "./components/habitTracker/habitTracker";

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
  const [isDateEditModalOpen, setIsDateModalOpen] = React.useState(false);
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

  // useEffect hooks to log when each component mounts
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe(); // ✅ Cleanup
  }, []);
  // After login, Firestore checks if a habit exists for the user. If it exists, it loads the saved habit & frequency. If it doesn’t exist, user continues to enter a new habit
  React.useEffect(() => {
    if (!user) {
      console.log("⏳ Waiting for user authentication before checking Firestore...");
      return; // Prevents Firestore query from running without authentication
    }
    
    console.log("🔄 Checking Firestore for saved habit...");
    
    const fetchHabit = async () => {
      try {
        // 🔐 Properly filter by authenticated user
        const q = query(
          collection(db, "habits"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        console.log("Firestore returned:", querySnapshot.docs.length, "documents");
        
        querySnapshot.docs.forEach((doc, index) => 
          console.log(`Doc ${index}:`, doc.data(), "(Created at:", doc.data().createdAt, ")")
        );
        
        if (!querySnapshot.empty) {
          const habitData = querySnapshot.docs[0].data();
          console.log("✅ Found habit:", habitData);

          // Set retrieved habit data in state
          setName(habitData.name);
          setTrackingHabit(habitData.habit);
          setFrequency(habitData.frequency);
          setCommitmentDate(habitData.commitmentDate);
          setFailureConsequence(habitData.failureConsequence);
          setSuccessConsequence(habitData.successConsequence);
          setHasEditedCommitmentDate(habitData.hasEditedCommitmentDate || false)
          
          setStep(8); // Move user to habit-tracking UI
        } else {
          console.log("🚨 No habit found for user:", user.uid);
        }
      } catch (error) {
        console.error("🚨 Error fetching habit:", error);
      }
    };
  
    fetchHabit();
  }, [user]); // ✅ Ensure effect runs only when `user` state updates

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
    if (!user) {
      console.log("🚨 User not logged in!");
      return;
    }
    setIsModalOpen(false);
    // 🚨 Ensure required fields are not empty before submission
    if (!name || !habit || !frequency || !commitmentDate || !failureConsequence || !successConsequence) {
    console.log("🚨 Error: All fields must be filled before saving.");
    return;
    }

    try {
      const docRef = doc(db, "habits", user.uid);
      await setDoc(docRef, {
        userId: user.uid,
        name: name,
        habit: habit,
        trackingHabit: habit, // 🛠️ You can rename trackingHabit later if needed
        frequency: frequency,
        commitmentDate: commitmentDate,
        failureConsequence: failureConsequence,
        successConsequence: successConsequence,
        setHasEditedCommitmentDate: false,
        createdAt: serverTimestamp(),
      });
      // ✅ Fetch the document we just saved for verification
      const savedDoc = await getDoc(docRef);
      if (savedDoc.exists()) {
        console.log("🛠️ Verified saved habit:", savedDoc.data());
      } else {
        console.log("🚨 Error: Habit document not found after saving.");
      }

      console.log("✅ Habit saved to Firestore:", habit);
      setTrackingHabit(habit); // ✅ Display the habit on homepage
      setStep(8); // Move user to the habit-tracking homepage
    } catch (error) {
      console.error("🚨 Error saving habit:", error);
    }
  }
    


  async function deleteHabit() {
  if (!user) return;

  try {
    const docRef = doc(db, "habits", user.uid);
    await deleteDoc(docRef);
    console.log("🗑️ Habit deleted! Starting fresh...");

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
  } catch (error) {
    console.error("🚨 Error deleting habit:", error);
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
  async function confirmDateEdit() {
    if (!user || !newCommitmentDate) {
      console.log("🚨 User not logged in or no new commitment date is selected.");
      return;
    }
      try {
      const docRef = doc(db, "habits", user.uid);
      await updateDoc(docRef, {
      commitmentDate: newCommitmentDate,
      hasEditedCommitmentDate: true // Mark that the date has been edited
    });
    console.log("✅ Commitment date updated to:", newCommitmentDate);

    // Update local state
    setCommitmentDate(newCommitmentDate);
    setIsEditingDate(false);
    setHasEditedCommitmentDate(true); // Mark that the date has been edited
    setIsDateModalOpen(false); // Close the modal
  } catch (error) {
    console.error("🚨 Error updating commitment date:", error);
  }}
  
  function cancelDateEdit() {
    setIsEditingDate(false);
    setIsDateModalOpen(false);
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
              isValid={isStepValid()} 
            />
          )}

          {/* Step 2: Enter Habit */}
          {step === 2 && (
            <HabitStep 
              habit={habit} 
              setHabit={setHabit} 
              onBack={() => setStep(1)} 
              onNext={() => setStep(3)} 
              isValid={isStepValid()} 
            />
          )}

          {/* Continue with other steps... */}

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
              confirmDateEdit={confirmDateEdit}
              cancelDateEdit={cancelDateEdit}
              logOut={logOut}
            />
          )}

          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
            message="⚠️ Your submission is final. You can't edit it unless you start over. Are you sure?"
          />
        </>
      ) : (
        <PhoneAuth setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}

export default HabitTracker;
