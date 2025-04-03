import { collection, query, where, getDocs, orderBy, limit, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Fetch user's habit
export const getHabitFromFirestore = async (userId: string) => {
  if (!userId) {
    console.log("⏳ Waiting for user authentication before checking Firestore...");
    return { 
      success: false, 
      message: "No user ID provided" 
    };
  }
  
  console.log("🔄 Checking Firestore for saved habit...");
  
  try {
    const q = query(
      collection(db, "habits"),
      where("userId", "==", userId),
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
      return { 
        success: true,
        habitData
      };
    } else {
      console.log("🚨 No habit found for user:", userId);
      return { 
        success: false, 
        message: "No habit found" 
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("🚨 Error fetching habit:", error);
      return {
        success: false,
        message: error.message
      };
    }
    else {
      return { 
        success: false, 
        message: "An unknown error occurred!" 
      };
    }
  }
};

// Save a new habit
export const saveHabit = async (
  userId: string | null, 
  habitData: {name: string, habit: string, frequency: string, commitmentDate: string, failureConsequenceType: 'app' | 'partner' | null , successConsequence: string, hasEditedCommitmentDate: boolean},
) => {
  if (!userId) {
    console.log("🚨 User not logged in!");
    return { 
      success: false, 
      message: "No user ID provided" 
    };
  }

  // Ensure required fields are not empty before submission
  const { name, habit, frequency, commitmentDate, failureConsequenceType, successConsequence } = habitData;
  if (!name || !habit || !frequency || !commitmentDate || !failureConsequenceType || !successConsequence) {
    console.log("🚨 Error: All fields must be filled before saving.");
    return { 
      success: false, 
      message: "All fields must be filled before saving" 
    };
  }

  try {
    const docRef = doc(db, "habits", userId);
    await setDoc(docRef, {
      userId,
      ...habitData,
      hasEditedCommitmentDate: habitData.hasEditedCommitmentDate || false,
      createdAt: serverTimestamp(),
    });
    
    // Fetch the document we just saved for verification
    const savedDoc = await getDoc(docRef);
    if (savedDoc.exists()) {
      console.log("🛠️ Verified saved habit:", savedDoc.data());
      return { 
        success: true, 
        habitData: savedDoc.data() 
      };
    } else {
      console.log("🚨 Error: Habit document not found after saving.");
      return { 
        success: false, 
        message: "Habit document not found after saving" 
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error)
    {
        console.error("🚨 Error saving habit:", error);
        return {
          success: false,
          message: error.message
        };
    }
    else {
      return { 
        success: false, 
        message: "An unknown error occurred!"
      };
    }
  }
};

// Update commitment date
export const updateCommitmentDate = async (userId: string | null, newDate: string) => {
  if (!userId || !newDate) {
    console.log("🚨 User not logged in or no new commitment date is selected.");
    return { 
      success: false, 
      message: "User ID or new date missing" 
    };
  }

  try {
    const docRef = doc(db, "habits", userId);
    await updateDoc(docRef, {
      commitmentDate: newDate,
      hasEditedCommitmentDate: true // Mark that the date has been edited
    });
    console.log("✅ Commitment date updated to:", newDate);
    return { 
      success: true,
      commitmentDate: newDate
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("🚨 Error updating commitment date:", error);
      return {
        success: false,
        message: error.message
      };
    } else {
      return { 
        success: false, 
        message: "An unknown error occurred!"
      };
    }}
    
    
};

// Delete a habit
export const deleteUserHabit = async (userId: string | null) => {
  if (!userId) return {
    success: false,
    message: "No user ID provided"
  };

  try {
    const docRef = doc(db, "habits", userId);
    await deleteDoc(docRef);
    console.log("🗑️ Habit deleted! Starting fresh...");
    return { success: true };
  } catch (error: any | null) {
    console.error("🚨 Error deleting habit:", error);
    return { 
      success: false, 
      message: error.message 
    };
  }
};