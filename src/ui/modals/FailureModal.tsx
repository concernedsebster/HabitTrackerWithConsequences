import React from "react";
import failureConsequenceStep from "src/components/habit/FailureConsequenceStep";

type failureModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    hasUsedFreeFailure: boolean;
    penaltyAmount: number | "" | null;
    failureConsequenceType: "partner" | "app" | null;
    restartSameHabit: () => void;
}

export default function FailureModal({ isOpen, onClose, onConfirm, hasUsedFreeFailure, penaltyAmount, failureConsequenceType, restartSameHabit}: failureModalProps) {
    const [step, setStep] = React.useState<"confirm" | "consequence">("confirm");

        if (!isOpen) return null;
        return (
            <div className="failure-modal-overlay">
              <div className="failure-modal-content">
          
                {step === "confirm" && (
                  <>
                    <h3>Confirm Failure</h3>
                    <p>{hasUsedFreeFailure 
                      ? "If you fail, you'll need to pay the consequence."
                      : "This is your one and only chance at declaring failure without consequences. Are you sure?"
                    }</p>
                    <button onClick={() => setStep("consequence")}>Declare Failure</button>
                    <button onClick={onClose}>Nevermind</button>
                  </>
                )}
          
                {step === "consequence" && (
                  <>
                    {failureConsequenceType === "partner" ? (
                      <>
                        <p>{hasUsedFreeFailure ? 'We’ve notified your accountability partner that you owe them ${penaltyAmount}' : 'Better luck next time! 💪 (This one\'s on us, if you fail again you\'ll have to pay up!)'}</p>
                        <button onClick={onConfirm}>Start a New Habit</button>
                        <button onClick={restartSameHabit}>Restart Current Habit</button>
                      </>
                    ) : (
                      <>
                        <p>You'll be charged ${penaltyAmount}</p>
                        <button onClick={onConfirm}>Pay & Start New Habit</button>
                        <button onClick={restartSameHabit}>Pay & Restart Current Habit</button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          );
}