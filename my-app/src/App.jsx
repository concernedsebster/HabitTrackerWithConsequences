import React from "react";
function HabitTracker() {
  const [habit, setHabit] = React.useState("");
  const [trackingHabit, setTrackingHabit] = React.useState("");
  const frequencyOptions = ["Everyday", "Every 2 days", "Every 3 days", "3 days a week"]
  const [frequency, setFrequency] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setTrackingHabit(habit);
    console.log("📝 Tracking habit set:", habit);
    setHabit("");
  }
  return (
    <div>
      <h1>Habit Tracker</h1>
      {trackingHabit ? 
      <>
        <h2>Your habit: {trackingHabit}</h2>
        <p>How often do you want to do this?</p>
        {frequencyOptions.map((option) => (
          <label key={option}>
            <input 
              type="radio" 
              name="habit frequency" 
              value={option} 
              onChange={(e) => {
                console.log("Frequency selected:", e.target.value)setFrequency(e.target.value)}
            />
            {option}
          </label>
        ))}
        <button onClick={() => setTrackingHabit("")}>Reset habit</button></>
      : <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setHabit(e.target.value)}
          type="text"
          id="habit"
          value={habit}
        ></input>
        <button type="submit">Track your One Habit</button>
      </form>}
    </div>
  );
}
export default HabitTracker;

