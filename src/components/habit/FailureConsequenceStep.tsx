import React from "react"
import  name  from "src/components/habit/NameStep"
import { getAuth } from "firebase/auth";

type FailureConsequenceStepProps = {
    failureConsequenceType: "partner" | "app" | null;
    setFailureConsequenceType: (value: "partner" | "app" | null) => void;
    penaltyAmount: number | "" | null;
    setPenaltyAmount: (value: number | "" | null) => void;
    name: string;
    hasClickedTextButton: boolean;
    setHasClickedTextButton: (value: boolean) => void;
    isInviteSent: boolean;
    setIsInviteSent: (value: boolean) => void;
    hasFailedBefore: boolean;
    setStep: (value: number) => void;

    onBack: () => void;
    onNext: () => void;
    isValid: () => boolean;
}

function FailureConsequenceStep({ failureConsequenceType, setFailureConsequenceType, penaltyAmount, setPenaltyAmount, name, hasClickedTextButton, setHasClickedTextButton, isInviteSent, setIsInviteSent, onBack, onNext, isValid, setStep, hasFailedBefore }: FailureConsequenceStepProps) {
    const [isAmountConfirmed, setIsAmountConfirmed] = React.useState(false);
    const userId = getAuth().currentUser?.uid
    if (!userId) {
        alert("Please log in before sending this invite.");
        return;
    }
    const message = `Hey! I'm committing to a habit using this app called OneHabit. Can you be my accountability partner?\n\nIf I fail at keeping my habit, I'll owe you $${penaltyAmount}!\n\nThe only thing you need to do is confirm your status as my partner at this link, no sign up needed.\n\nhttp://localhost:5174/accountability?userId=${userId}&name=${encodeURIComponent(name)}&penaltyAmount=${penaltyAmount}`;
    const encodedMessage = encodeURIComponent(message);
    return (
        <>
            {failureConsequenceType === null && (
                <>
                    <p>How do you want to be held accountable to your goal?</p>
                    <label>
                        <input
                        type="radio"
                        value="partner"
                        checked={failureConsequenceType === "partner"}
                        onChange={() => setFailureConsequenceType("partner")}
                        />
                    Pay a friend if I fail
                    </label>
                    <label>
                        <input
                        type="radio"
                        value="app"
                        checked={failureConsequenceType === "app"}
                        onChange={() => setFailureConsequenceType("app")}
                        />
                    Pay the app if I fail
                    </label>
                </>
            )}

            {failureConsequenceType !== null && !isAmountConfirmed && (
                <>
                    <label>
                        <input
                            type="number"
                            value={penaltyAmount ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                setPenaltyAmount(val === "" ? null : Number(val));
                            }}
                        />
                    How much do you want to pay if you fail?
                    </label>
                    <button onClick={() => setIsAmountConfirmed(true)}>Confirm Amount</button>
                </>
            )}

            {isAmountConfirmed && failureConsequenceType === "partner" && (
                <>
                        <div>
                            <p>Text your friend to hold you accountable <br />
                            <strong>They'll need to confirm their status as your accountability partner (no sign up required) before you can begin logging your habit.</strong>
                            </p>
                            <br />
                            <button onClick={() => {
                                setHasClickedTextButton(true);
                                window.open(`sms:&body=${encodedMessage}`, "_blank");
                                }}>
                                Text My Friend
                            </button>
                            <button disabled={!hasClickedTextButton} onClick={hasFailedBefore ? () => setStep(7) : () => onNext()}>
                            I've Sent the Invite
                            </button>
                        </div>
                    
                </>
            )}

            {isAmountConfirmed && failureConsequenceType === "app" && (
                <p>You’ll be charged this amount automatically by the app if you fail. You’ll set up payment on the next screen.</p>
            )}

            <button onClick={() => {
                if (failureConsequenceType !== null) {
                    setFailureConsequenceType(null);
                } else {
                    onBack();
                }
            }}>
                Back
            </button>
        </>
    )
}
export default FailureConsequenceStep;