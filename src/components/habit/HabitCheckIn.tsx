import React from "react";
import DeleteHabitModal from "src/ui/modals/DeleteHabitModal";
import FailureModal from "src/ui/modals/FailureModal";
import { doc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import FailureConsequenceVerificationModal from "src/ui/modals/FailureConsequenceVerificationModal";


type HabitCheckInProps = {
    habit: string;
    deleteHabit: () => void;
    userId: string | null;
    successConsequence: string;
    penaltyAmount: number | "" | null;
    failureConsequenceType: "partner" | "app" | null;
    partnerIsVerified: boolean | null;
    setPartnerIsVerified: (value: boolean) => void;
    setStep: (value: number) => void;
    setShowFailureConsequenceVerificationModal: (value: boolean) => void;
    hasUsedFreeFailure: boolean;
    setHasUsedFreeFailure: (value: boolean) => void;
    isRestartingSameHabit: boolean;
    setIsRestartingSameHabit: (value: boolean) => void;
}

export default function HabitCheckIn(
    {
        habit, 
        deleteHabit, 
        userId, 
        successConsequence, 
        penaltyAmount, 
        failureConsequenceType, 
        partnerIsVerified,  
        setStep,  
        setPartnerIsVerified, 
        setShowFailureConsequenceVerificationModal,
        setHasUsedFreeFailure,
        hasUsedFreeFailure,
        isRestartingSameHabit,
        setIsRestartingSameHabit
    }: HabitCheckInProps) {
    
    const [isFailureModalOpen, setIsFailureModalOpen] = React.useState(false);
    console.log("Penalty Amount in HabitCheckIn:", penaltyAmount)
    const [isLoadingRestart, setIsLoadingRestart] = React.useState(false);
   
    function handleSuccess() {
            // show success modal, update Firestore
    }
    async function handleFailureConfirm() {
        console.log("hasUsedFreeFailure:", hasUsedFreeFailure);
        if (!hasUsedFreeFailure) {
            const firestore = getFirestore();
            if (!userId) {
                console.error("Missing userId. Cannot update hasUsedFreeFailure in Firestore.");
                return;
            }
            const docRef = doc(firestore, "users", userId);
            await updateDoc(docRef, {hasUsedFreeFailure: true});
            setHasUsedFreeFailure(true);
            deleteHabit();
        } else {
            // proceed with consequence flow (modal or redirect based on failureConsequenceType)
        }   
    }

    async function restartSameHabit() {
        if (!userId) {
            console.error("Missing userId! Can't restart same habit.")
            return;
        }
        setIsLoadingRestart(true);
        setIsRestartingSameHabit(true); // ✅ Set this immediately for logical flow handling
        const firestore = getFirestore();
        const docRef = doc(firestore, "habits", userId);
        try {
            await deleteDoc(docRef);
            console.log("Deleting habit from Firestore...");
            setHasUsedFreeFailure(true);
            console.log("Set hasUsedFreeFailure to true.");
            setPartnerIsVerified(false);
            console.log("Reset partner verification status to false.");
            setTimeout(()=> {
                setIsLoadingRestart(false);
                setShowFailureConsequenceVerificationModal(true);
            }, 1000);
            console.log("🔁 Restarting same habit from local state memory, not Firestore.");
        } catch (error) {
            console.error("Failed to restart same habit:", error);
        }
    }

    if (isLoadingRestart) {
        return (
          <div
            className="restart-screen"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "white",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1>🧹🧹🧹</h1>
            <h2>Restarting your habit...</h2>
          </div>
        );
      }

    
        return (
    <>
        <div>
        <h1>Habit Check In</h1>
        <h3>{habit}</h3>
        <p>Did you do it?</p>
        <button onClick={handleSuccess}>Yes</button>
        <button onClick={()=>setIsFailureModalOpen(true)}>No</button>
        </div>
        
        <FailureModal
            isOpen={isFailureModalOpen}
            onClose={() => setIsFailureModalOpen(false)}
            onConfirm={handleFailureConfirm}
            hasUsedFreeFailure={hasUsedFreeFailure}
            penaltyAmount={penaltyAmount}
            failureConsequenceType={failureConsequenceType}
            restartSameHabit={restartSameHabit}
        />
    </>
        
    )
}
