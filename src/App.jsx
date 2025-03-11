import React from "react";
import PhoneAuth from "./PhoneAuth";
import { signOut } from "firebase/auth";
import { db } from "../firebaseConfig"; // ✅ Import Firestore
import { collection, addDoc, where, getDocs, getDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore"; // ✅ Firestore functions
import { auth } from "../firebaseConfig"; // ✅ Import Firebase Auth
import { onAuthStateChanged } from "firebase/auth"; // ✅ Listen for auth state changes

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
        createdAt: serverTimestamp(),
      });
      // ✅ Fetch the document we just saved for verification
      const savedDoc = await getDoc(docRef);
      console.log("🛠️ Verified saved habit:", savedDoc.data());

      console.log("✅ Habit saved to Firestore:", habit);
      setTrackingHabit(habit); // ✅ Display the habit on homepage
      setStep(8); // Move user to the habit-tracking homepage
    } catch (error) {
      console.error("🚨 Error saving habit:", error);
    }
  }

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>✨One Habit✨</h1>
          <button onClick={logOut}>Log Out</button>

          {/* Step 1: Enter Name */}
          {step === 1 && (
            <>
              <p>What's your name?</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={() => setStep(2)} disabled={!isStepValid()}>
                Next
              </button>
            </>
          )}

          {/* Step 2: Enter Habit */}
          {step === 2 && (
            <>
              <p>What habit do you want to track?</p>
              <input
                type="text"
                value={habit}
                onChange={(e) => setHabit(e.target.value)}
              />
              <button onClick={() => setStep(1)}>Back</button>
              <button onClick={() => setStep(3)} disabled={!isStepValid()}>
                Next
              </button>
            </>
          )}

          {/* Step 3: Select Frequency */}
          {step === 3 && (
            <>
              <p>How often do you want to do this?</p>
              {frequencyOptions.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="habitFrequency"
                    value={option}
                    onChange={(e) => setFrequency(e.target.value)}
                  />
                  {option}
                </label>
              ))}
              <button onClick={() => setStep(2)}>Back</button>
              <button onClick={() => setStep(4)} disabled={!isStepValid()}>
                Next
              </button>
            </>
          )}

          {/* Step 4: Select Commitment Date */}
          {step === 4 && (
            <>
              <p>How long do you want to commit to this habit?</p>
              <input
                type="date"
                value={commitmentDate}
                onChange={(e) => setCommitmentDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              <button onClick={() => setStep(3)}>Back</button>
              <button onClick={() => setStep(5)} disabled={!isStepValid()}>
                Next
              </button>
            </>
          )}

          {/* Step 5: Failure Consequence */}
          {step === 5 && (
            <>
              <p>What happens if you fail?</p>
              <input
                type="text"
                value={failureConsequence}
                onChange={(e) => setFailureConsequence(e.target.value)}
              />
              <button onClick={() => setStep(4)}>Back</button>
              <button onClick={() => setStep(6)} disabled={!isStepValid()}>
                Next
              </button>
            </>
          )}

          {/* Step 6: Success Reward */}
          {step === 6 && (
            <>
              <p>What reward will you get if you succeed?</p>
              <input
                type="text"
                value={successConsequence}
                onChange={(e) => setSuccessConsequence(e.target.value)}
              />
              <button onClick={() => setStep(5)}>Back</button>
              <button onClick={() => setStep(7)} disabled={!isStepValid()}>
                Next
              </button>
            </>
          )}

          {/* Step 7: Review & Confirm */}
          {step === 7 && (
            <>
              <h2>Review Your Habit Plan</h2>
              <p>
                <strong>{name}</strong> is committing to{" "}
                <strong>{habit}</strong> for <strong>{frequency}</strong>, until{" "}
                <strong>{commitmentDate}</strong>. If they fail,{" "}
                <strong>{failureConsequence}</strong> will happen. If they
                succeed, they will <strong>{successConsequence}</strong>.
              </p>
              <button onClick={() => setStep(6)}>Back</button>
              <button onClick={handleSubmit}>Track Your One Habit</button>
            </>
          )}

          {step === 8 && (
            <>
              <h2>Your Habit Tracker</h2>
              <p><strong>{name}</strong> is tracking <strong>{trackingHabit}</strong> with a frequency of <strong>{frequency}</strong>, until <strong>{commitmentDate}</strong>.</p>
              <p>If you fail, <strong>{failureConsequence}</strong> happens. If you succeed, <strong>{successConsequence}</strong> happens!</p>
              <button onClick={logOut}>Log Out</button>
            </>
          )}
        </>
      ) : (
        <PhoneAuth setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}

export default HabitTracker;
