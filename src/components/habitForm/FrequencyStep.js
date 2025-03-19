import React from "react"

function FrequencyStep({ frequency, setFrequency, onBack, onNext, isValid }) {
    return (
        <>
              <p>How often do you want to do this?</p>
              {frequencyOptions.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="habitFrequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  />
                  {option}
                </label>
              ))}
              <button onClick={onBack}>Back</button>
              <button onClick={onNext} disabled={!isValid()}>
                Next
              </button>
            </>
    )
}
export default FrequencyStep;