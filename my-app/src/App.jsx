import React from "react";
import PhoneAuth from "./PhoneAuth";
import { signOut } from "firebase/auth";
import { db } from "../firebaseConfig"; // ✅ Import Firestore
import { collection, addDoc, where, getDocs } from "firebase/firestore"; // ✅ Firestore functions
import { auth } from "../firebaseConfig"; // ✅ Import Firebase Auth
import { onAuthStateChanged } from "firebase/auth"; // ✅ Listen for auth state changes

function HabitTracker() {
  React.useEffect(() => {
    console.log("✅ Habit tracker successfully loaded!");
  }, []);

  // State declarations
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [habit, setHabit] = React.useState("");
  const [trackingHabit, setTrackingHabit] = React.useState("");
  const [frequency, setFrequency] = React.useState("");
  const [commitmentDate, setCommitmentDate] = React.useState("");

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
    if (user) {
      console.log("🔄 Checking Firestore for saved habit...");
      const fetchHabit = async () => {
        try {
          const q = query(
            collection(db, "habits"),
            where("userId", "==", user.uid),
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const habitData = querySnapshot.docs[0].data();
            console.log("✅ Found habit:", habitData);
            setTrackingHabit(habitData.habit);
            setFrequency(habitData.frequency);
            setCommitmentDate(habitData.commitmentDate);
          } else {
            console.log("🚨 No habit found for user:", user.uid);
          }
        } catch (error) {
          console.error("🚨 Error fetching habit:", error);
        }
      };
      fetchHabit();
    }
  }, [user]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      console.log("🚨 User not logged in!");
      return;
    }
    try {
      await addDoc(collection(db, "habits"), {
        userId: user.uid,
        habit: habit,
        trackingHabit: trackingHabit,
        frequency: frequency,
        commitmentDate: commitmentDate,
        createdAt: new Date(),
      });
      console.log("✅ Habit saved to Firestore:", habit);
      setTrackingHabit(habit);
      console.log("📝 Tracking habit set:", habit);
      setHabit("");
    } catch (error) {
      console.error("🚨 Error saving habit:", error);
    }
  }

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>Habit Tracker</h1>
          <button onClick={logOut}>Log Out</button>
          {trackingHabit ? (
            <>
              <h2>Your habit: {trackingHabit}</h2>
              <p>How often do you want to do this?</p>
              {frequencyOptions.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="habit frequency"
                    value={option}
                    onChange={(e) => {
                      console.log("Frequency selected:", e.target.value);
                      setFrequency(e.target.value);
                    }}
                  />
                  {option}
                </label>
              ))}
              {frequency && (
                <div>
                  <p>How long do you want to commit to this one habit?</p>
                  <input
                    type="date"
                    value={commitmentDate}
                    onChange={(e) => setCommitmentDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Set min date to today's date
                  />
                </div>
              )}
              <button onClick={() => setTrackingHabit("")}>Reset habit</button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                onChange={(e) => setHabit(e.target.value)}
                type="text"
                id="habit"
                value={habit}
              />
              <button type="submit">Track your One Habit</button>
            </form>
          )}
        </>
      ) : (
        <PhoneAuth setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}

export default HabitTracker;
