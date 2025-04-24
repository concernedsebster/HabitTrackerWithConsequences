import React from "react";
import DeleteHabitModal from "src/ui/modals/DeleteHabitModal";
import FailureModal from "src/ui/modals/FailureModal";
import { doc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";


type HabitCheckInProps = {
    habit: string;
    deleteHabit: () => void;
    userId: string | null;
    successConsequence: string;
    penaltyAmount: number | "" | null;
    failureConsequenceType: "partner" | "app" | null;
    partnerIsVerified: boolean | null;
    setPartnerIsVerified: (value: boolean) => void;
    hasFailedBefore: boolean;
    setStep: (value: number) => void;
    setHasFailedBefore: (value: boolean) => void;
}

export default function HabitCheckIn({habit, deleteHabit, userId, successConsequence, penaltyAmount, failureConsequenceType, partnerIsVerified, hasFailedBefore, setStep, setHasFailedBefore, setPartnerIsVerified}: HabitCheckInProps) {
    
    const [isFailureModalOpen, setIsFailureModalOpen] = React.useState(false);
    console.log("Penalty Amount in HabitCheckIn:", penaltyAmount)
    const [isRestarting, setIsRestarting] = React.useState(false);
   
    function handleSuccess() {
            // show success modal, update Firestore
    }
    async function handleFailureConfirm() {
        console.log("hasFailedBefore:", hasFailedBefore);
        if (!hasFailedBefore) {
            const firestore = getFirestore();
            if (!userId) {
                console.error("Missing userId. Cannot update hasFailedBefore in Firestore.");
                return;
            }
            const docRef = doc(firestore, "habits", userId);
            await updateDoc(docRef, {hasFailedBefore: true});
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
        setIsRestarting(true);
        const firestore = getFirestore();
        const docRef = doc(firestore, "habits", userId);
        try {
            await deleteDoc(docRef);
            console.log("Deleting habit from Firestore...")
            setHasFailedBefore(true);
            console.log("Set hasFailedBefore to true.")
            setPartnerIsVerified(false);
            console.log("Reset partner verification status to false.")
            setTimeout(()=> {
                setIsRestarting(false);
                setStep(7);
            }, 1000);
            console.log("🔁 Restarting same habit from local state memory, not Firestore.")
        } catch (error) {
            console.error("Failed to restart same habit:", error);
        }
    }

    if (isRestarting) {
        return (
          <div className="restart-screen">
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
            hasFailedBefore={hasFailedBefore}
            penaltyAmount={penaltyAmount}
            failureConsequenceType={failureConsequenceType}
            restartSameHabit={restartSameHabit}
        />
    </>
        
    )
}

