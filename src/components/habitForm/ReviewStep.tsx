import React from "react";
import Modal from "../../modals/ConfirmationModal";

type ReviewStepProps = {
    // Habit Summary Values
    name: string;
    habit: string;
    frequency: string;
    commitmentDate: string;
    failureConsequence: string;
    successConsequence: string;
    // Navigation Values
    onBack: () => void;
    onSubmit: () => void;
    // Modal values
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    handleSubmit: () => void;
}

function ReviewStep({ name, habit, frequency, commitmentDate, failureConsequence, successConsequence, onBack, onSubmit, isModalOpen, setIsModalOpen, handleSubmit }: ReviewStepProps) {
    return (
        <>
            <h2>Review Your Habit Plan</h2>
            <p>
                <strong>{name}</strong> is committing to{" "}
                <strong>{habit}</strong> for <strong>{frequency}</strong>, until{" "}
                <strong>{commitmentDate}</strong>. If they fail,{" "}
                <strong>{failureConsequence}</strong> will happen. If they
                succeed, they will <strong>{successConsequence}</strong>.
            </p>
            <div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleSubmit}
                    message="⚠️ Your submission is final. You can't edit it unless you start over. Are you sure?"
                />
            </div>
            <button onClick={onBack}>Back</button>
            <button onClick={() => setIsModalOpen(true)}>Track Your One Habit</button>
        </>
    );
}

export default ReviewStep;