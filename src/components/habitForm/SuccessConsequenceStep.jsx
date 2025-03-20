import React from "react"
function SuccessConsequenceStep({ successConsequence, setSuccessConsequence, onBack, onNext, isValid }) {
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