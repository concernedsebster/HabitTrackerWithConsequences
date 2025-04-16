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
}

function ReviewStep({ name, habit, frequency, commitmentDate, failureConsequenceType, penaltyAmount, successConsequence, onBack, onSubmit, isModalOpen, setIsModalOpen, handleSubmit, isSavingHabit }: ReviewStepProps) {
    return (
        <>
            <h2>Review Your Habit Plan</h2>
            <ul>
                <li><strong>Your habit:</strong> {habit}</li>
                 <li><strong>Frequency:</strong> {frequency}</li>
                <li><strong>Until:</strong> {commitmentDate}</li> 
                <li><strong>Failure consequence:</strong> {(failureConsequenceType === 'partner') ? `Pay a friend ${penaltyAmount}` : "Pay the app ${penaltyAmount}" }</li>
                <li><strong>Reward if successful:</strong> {successConsequence}</li>
            </ul>
            <div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleSubmit}
                    message="⚠️ Your submission is final. You can't edit it unless you start over. Are you sure?"
                />
            </div>
            <button onClick={onBack}>Back</button>
            <button disabled={isSavingHabit} onClick={() => setIsModalOpen(true)}>{isSavingHabit ? "Saving..." : "Track Your One Habit"}</button>
        </>
    );
}

export default ReviewStep;