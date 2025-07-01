import React from "react";

type NameStepProps = {
    name: string;
    setName: (name: string) => void;
    onNext: () => void;
    isValid: () => boolean;
};

function NameStep({ name, setName, onNext, isValid}: NameStepProps) {
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