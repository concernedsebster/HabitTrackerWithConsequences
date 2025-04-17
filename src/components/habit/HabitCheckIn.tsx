import React from "react";
import DeleteHabitModal from "src/ui/modals/DeleteHabitModal";
import FailureModal from "src/ui/modals/FailureModal";
import { doc, updateDoc, getFirestore } from "firebase/firestore";


type HabitCheckInProps = {
    habit: string;
    deleteHabit: () => void;
    userId: string | null;
    successConsequence: string;
    penaltyAmount: number | "" | null;
    failureConsequenceType: "partner" | "app" | null;
    partnerIsVerified: boolean | null;
    hasFailedBefore: boolean;
}

export default function HabitCheckIn({habit, deleteHabit, userId, successConsequence, penaltyAmount, failureConsequenceType, partnerIsVerified, hasFailedBefore}: HabitCheckInProps) {
    
    const [isFailureModalOpen, setIsFailureModalOpen] = React.useState(false);
   
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
        />
    </>
        
    )
}

