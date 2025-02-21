import { useState } from "react";

function App() {
  const [habit, setHabit] = useState(""); // Stores the habit input
  const [trackingHabit, setTrackingHabit] = useState(null); // Stores the active habit

  const handleSubmit = (event) => {
    event.preventDefault();

    if (habit.trim() === "" || trackingHabit) return; // Prevent empty habit or multiple submissions

    setTrackingHabit(habit); // Save the habit for tracking
    setHabit(""); // Clear input field
  };

  const handleReset = () => {
    setTrackingHabit(null); // Allow user to enter a new habit
  };

  return (
    <div>
      <h1>Habit Tracker</h1>

      {!trackingHabit ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a habit..."
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
          />
          <button type="submit">Track Habit</button>
        </form>
      ) : (
        <div>
          <h2>Tracking: {trackingHabit}</h2>
          <button onClick={handleReset}>Reset Habit</button>
        </div>
      )}
    </div>
  );
}

export default App;
