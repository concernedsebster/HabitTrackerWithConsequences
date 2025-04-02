import React from "react"

type FailureConsequenceStepProps = {
    failureConsequenceType: "partner" | "app" | null;
    setFailureConsequenceType: (value: "partner" | "app" | "null") => void;
    partnerPhone: string;
    setPartnerPhone: (value: string) => void;
    penaltyAmount: number | "";
    setPenaltyAmount: (value: number | "") => void;

    onBack: () => void;
    onNext: () => void;
    isValid: () => boolean;
}

function FailureConsequenceStep({ failureConsequenceType, setFailureConsequenceType, partnerPhone, setPartnerPhone, penaltyAmount, setPenaltyAmount, onBack, onNext, isValid }: FailureConsequenceStepProps) {
    return (
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
            <label>
                <input
                    type="number"
                    value={penaltyAmount}
                    onChange={(e) => setPenaltyAmount(e.target.value === "" ? "" : Number(e.target.value))}
                />
            How much do you want to pay if you fail?
            </label>
            {failureConsequenceType === "partner" && (
                <label>
                    <input
                        type="tel"
                        value={partnerPhone}
                        onChange={(e) => setPartnerPhone(e.target.value)}
                    />
                Your friend's phone number
                </label>
            )}
            {failureConsequenceType === "app" && (
                <p>You’ll be charged this amount automatically by the app if you fail. You’ll set up payment on the next screen.</p>
            )}
            <button onClick={onBack}>Back</button>
        </>
    )
}
export default FailureConsequenceStep;