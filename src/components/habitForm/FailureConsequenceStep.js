import React from "react"

function FailureConsequenceStep({ failureConsequence, setFailureConsequence, onBack, onNext, isValid }) {
    return (
        <>
            <p>What happens if you fail?</p>
            <input
            type="text"
            value={failureConsequence}
            onChange={(e) => setFailureConsequence(e.target.value)}
            />
            <button onClick={onBack}>Back</button>
            <button onClick={onNext} disabled={!isValid()}>
            Next
            </button>
        </>
    )
}
export default FailureConsequenceStep;