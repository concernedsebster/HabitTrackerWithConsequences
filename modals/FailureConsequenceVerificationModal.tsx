import React from "react";

type FailureConsequenceVerificationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    setStep: (value: number) => void;
    failureConsequenceType: "partner" | "app" | null;
    setFailureConsequenceType: (value: "partner" | "app" | null) => void;
    setHasClickedTextButton: (value: boolean) => void;
    setIsAmountConfirmed: (value: boolean) => void;
    setHasConfirmedFailureConsequenceType: (value: boolean) => void;
    giveUpCount: number;

}

export default function FailureConsequenceVerificationModal(
    {isOpen, 
    onClose, 
    setStep, 
    failureConsequenceType, 
    setFailureConsequenceType,
    setHasClickedTextButton, 
    setIsAmountConfirmed,
    setHasConfirmedFailureConsequenceType,
    giveUpCount
}
    : FailureConsequenceVerificationModalProps) {
        if (!isOpen) return null;

    function handlePartnerSelect() {
        setFailureConsequenceType("partner");
        setStep(5);
        setHasClickedTextButton(false);
        setIsAmountConfirmed(true);
        setHasConfirmedFailureConsequenceType(true);
        onClose();
    }

    function handleAppSelect() {
        setFailureConsequenceType("app");
        setHasConfirmedFailureConsequenceType(true);
        setStep(7);
        onClose();
    }
    
        return (
            <>
            {isOpen}
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>How do you want to be held accountable this time?</h3>
                        <div className="modal-buttons">
                            <button disabled={giveUpCount >= 2}onClick={handlePartnerSelect}>Pay a Friend</button>
                            <p style={{ color: 'gray', fontSize: 12, marginTop: 4 }}>Pay a Friend is disabled until you succeed in at least one habit.</p>
                            <button onClick={handleAppSelect}>Pay the App</button>
            </div>
                </div>
                    </div>
            </>
        )
}
//<button disabled={!hasClickedTextButton} onClick={isRestartingSameHabit