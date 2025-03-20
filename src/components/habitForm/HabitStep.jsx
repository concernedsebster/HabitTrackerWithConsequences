import React from "react";

function HabitStep({ habit, setHabit, onBack, onNext, isValid }) {
    return (
    <>
        <p>What habit do you want to track?</p>
        <input
        type="text"
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        />
        <button onClick={onBack}>Back</button>
        <button onClick={onNext} disabled={!isValid()}>
        Next
        </button>
    </>
    );
}
export default HabitStep;