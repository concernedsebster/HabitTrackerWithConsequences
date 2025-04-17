import React from "react";
import DeleteHabitModal from "src/ui/modals/DeleteHabitModal";

type HabitCheckInProps = {
    habit: string;
    successConsequence: string;
    penaltyAmount: number | "" | null;
    failureConsequenceType: "partner" | "app" | null;
    partnerIsVerified: boolean | null;
    hasFailedBefore: boolean;

}

type failureModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    hasFailedBefore: boolean;
}

function failureModal({ isOpen, onClose, onConfirm, hasFailedBefore}: failureModalProps) {
    if (!isOpen) return null;
    return  (
        <div className="failure-modal-overlay">
            <div className="failure-modal-content">
                <h3>Confirm Failure</h3>
                {hasFailedBefore ? <p>You've used up your one free failure. Now you need to pay the consequence.</p> : <p>This is your one and only chance at declaring failure without consequences. Are you sure?</p>}
                <div className="failure-modal-buttons">
                    <button onClick={onConfirm}>💀Declare FailureFailure💀</button>
                    <button onClick={onClose}>Nevermind</button>
                </div>
            </div>
        </div>
    )
}

export default function HabitCheckIn({habit, successConsequence, penaltyAmount, failureConsequenceType, partnerIsVerified, hasFailedBefore}: HabitCheckInProps) {
    return (
        
        <div>
        <h1>Habit Check In</h1>
        <h3>{habit}</h3>
        <p>Did you do it?</p>
        <button>Yes</button>
        <button onClick={failureModal}>No</button>
        </div>
        
    )
}

