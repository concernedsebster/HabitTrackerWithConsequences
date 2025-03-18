import React from "react";

function NameStep({ name, setName, onNext, isValid}) {
    return (
        <>
            <p>What's your name?</p>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <button onClick={onNext} disabled={!isValid()}>
            Next
            </button>
        </>
    )
}
export default NameStep;