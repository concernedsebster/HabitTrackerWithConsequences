import React from "react"

type commitmentDateStepProps = {
    commitmentDate: string;
    setCommitmentDate: (value: string) => void;
    onBack: () => void;
    onNext: () => void;
    isValid: () => boolean;
}

function CommitmentDateStep({ commitmentDate, setCommitmentDate, onBack, onNext, isValid }: commitmentDateStepProps) {
    return (
        <>
            <p>How long do you want to commit to this habit?</p>
            <input
            type="date"
            value={commitmentDate}
            onChange={(e) => setCommitmentDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            />
            <button onClick={onBack}>Back</button>
            <button onClick={onNext} disabled={!isValid()}>
            Next
            </button>
        </>
    )
}
export default CommitmentDateStep;