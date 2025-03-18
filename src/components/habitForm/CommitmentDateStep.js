import React from "react"
function CommitmentDateStep({ commitmentDate, setCommitmentDate, onBack, onNext, isValid }) {
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