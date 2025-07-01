import React from "react"
type SuccessConsequenceStepProps = {
    successConsequence: string;
    setSuccessConsequence: (value: string) => void;
    onBack: () => void;
    onNext: () => void;
    isValid: () => boolean;
}

function SuccessConsequenceStep({ successConsequence, setSuccessConsequence, onBack, onNext, isValid }: SuccessConsequenceStepProps) {
    return (
        <>
            <p>What reward will you get if you succeed?</p>
            <input
            type="text"
            value={successConsequence}
            onChange={(e) => setSuccessConsequence(e.target.value)}
            />
            <button onClick={onBack}>Back</button>
            <button onClick={onNext} disabled={!isValid()}>
            Next
            </button>
        </>
    )
}
export default SuccessConsequenceStep;