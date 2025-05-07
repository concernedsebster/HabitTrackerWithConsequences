import React from "react";
import Modal from "src/ui/modals/ConfirmationModal";

type ReviewStepProps = {
    // Habit Summary Values
    name: string;
    habit: string;
    frequency: string;
    commitmentDate: string;
    failureConsequenceType: 'app' | 'partner' | null;
    successConsequence: string;
    partnerPhone: string;
    penaltyAmount: number | '' | null;
    // Navigation Values
    onBack: () => void;
    onSubmit: () => void;
    // Modal values
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    handleSubmit: () => void;
    isSavingHabit: boolean;
    hasUsedFreeFailure: boolean;
}

function ReviewStep({ name, habit, frequency, commitmentDate, failureConsequenceType, penaltyAmount, successConsequence, onBack, onSubmit, isModalOpen, setIsModalOpen, handleSubmit, isSavingHabit, hasUsedFreeFailure }: ReviewStepProps) {
    if (isSavingHabit) {
        return (
          <div
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
            <h2>Saving your habit...</h2>
          </div>
        );
      }
      
    return (
        <>
            <h2>Review Your Habit Plan</h2>
            <ul>
                <li><strong>Your habit:</strong> {habit}</li>
                 <li><strong>Frequency:</strong> {frequency}</li>
                <li><strong>Until:</strong> {commitmentDate}</li> 
                <li><strong>Consequence if you fail:</strong> {(failureConsequenceType === 'partner') ? `Pay a friend ${penaltyAmount}.` : `Pay the app ${penaltyAmount}` }</li>
                <li><strong>Reward if successful:</strong> {successConsequence}</li>
            </ul>
            {hasUsedFreeFailure ? <h3>⚠️Friendly reminder that if you fail, you'll have to pay up!⚠️</h3> : <h3>⚠️You get <strong>one and only chance</strong> to fail without consequences. After that, you'll have to pay up!⚠️</h3>}
            <div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleSubmit}
                    message="⚠️ Your submission is final. You won't be able to edit it. Are you sure?"
                />
            </div>
            <button onClick={onBack}>Back</button>
            <button disabled={isSavingHabit} onClick={() => setIsModalOpen(true)}>{isSavingHabit ? "Saving..." : "Track Your One Habit"}</button>
        </>
    );
}

export default ReviewStep;