import React from "react";
import GiveUpModal from "src/ui/modals/GiveUpModal";
import FailureModal from "src/ui/modals/FailureModal";
import { doc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { markFreeFailureUsed } from "src/services/userService";


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
    restartSameHabit: () => void;
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
        setIsRestartingSameHabit,
        restartSameHabit,
    }: HabitCheckInProps) {
    
    const [isFailureModalOpen, setIsFailureModalOpen] = React.useState(false);
    console.log("Penalty Amount in HabitCheckIn:", penaltyAmount)
    const [isLoadingRestart, setIsLoadingRestart] = React.useState(false);
   
    function handleSuccess() {
            // show success modal, update Firestore
    }
    async function handleFailureConfirm() {
        console.log("hasUsedFreeFailure:", hasUsedFreeFailure);
        if (!userId) {
            console.error("❌ Cannot proceed: userId is null in handleFailureConfirm. Habit failure logic skipped.");
            return;
          }
        if (!hasUsedFreeFailure) {
            await markFreeFailureUsed(userId);
            setHasUsedFreeFailure(true);
            deleteHabit();
            console.log("✅ Free failure recorded in Firestore and habit deleted.");
        } else {
            // proceed with consequence flow (modal or redirect based on failureConsequenceType)
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
