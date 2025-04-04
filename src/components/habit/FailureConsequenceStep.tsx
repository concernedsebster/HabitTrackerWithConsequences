import React from "react"

type FailureConsequenceStepProps = {
    failureConsequenceType: "partner" | "app" | null;
    setFailureConsequenceType: (value: "partner" | "app" | null) => void;
    partnerPhone: string;
    setPartnerPhone: (value: string) => void;
    penaltyAmount: number | "" | null;
    setPenaltyAmount: (value: number | "" | null) => void;
    hasClickedTextButton: boolean;
    setHasClickedTextButton: (value: boolean) => void;
    isInviteSent: boolean;
    setIsInviteSent: (value: boolean) => void;

    onBack: () => void;
    onNext: () => void;
    isValid: () => boolean;
}

function FailureConsequenceStep({ failureConsequenceType, setFailureConsequenceType, partnerPhone, setPartnerPhone, penaltyAmount, setPenaltyAmount, hasClickedTextButton, setHasClickedTextButton, isInviteSent, setIsInviteSent, onBack, onNext, isValid }: FailureConsequenceStepProps) {
    const [isAmountConfirmed, setIsAmountConfirmed] = React.useState(false);

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
                    <label>
                        <input
                            type="tel"
                            value={partnerPhone}
                            onChange={(e) => setPartnerPhone(e.target.value)}
                        />
                    Your friend's phone number
                    </label>
                    {partnerPhone.length > 5 && (
                        <div>
                            <p>Text your friend to hold you accountable <br />
                            <strong>They'll need to confirm their status as your accountability partner (no sign up required) before you can begin logging your habit.</strong>
                            </p>
                            <button onClick={() => {
                                setHasClickedTextButton(true);
                                window.open(`sms:&body=Hey, I'm committing to a habit using OneHabit...`, "_blank");
                                }}>
                                Text My Friend
                            </button>

                            <button disabled={!hasClickedTextButton} onClick={onNext}>
                            I've Sent the Invite
                            </button>
                        </div>
                    )}
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