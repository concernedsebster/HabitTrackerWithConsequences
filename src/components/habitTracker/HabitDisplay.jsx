// src/components/habitTracker/HabitDisplay.js
import React from 'react';
import DeleteHabitModal from 'src/modals/DeleteHabitModal.js';
import DateEditModal from 'src/modals/DateEditModal.js';

function HabitDisplay({ 
  name, 
  trackingHabit, 
  frequency, 
  commitmentDate,
  failureConsequence,
  successConsequence,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  deleteHabit,
  hasEditedCommitmentDate,
  handleEditDateClick,
  isEditingDate,
  newCommitmentDate,
  setNewCommitmentDate,
  isDateEditModalOpen,
  confirmDateEdit,
  cancelDateEdit,
  logOut
}) {
  return (
    <>
      <h2>Your Habit Tracker</h2>
      <p><strong>{name}</strong> is tracking <strong>{trackingHabit}</strong> with a frequency of <strong>{frequency}</strong>, until <strong>{commitmentDate}</strong>.</p>
      <p>If you fail, <strong>{failureConsequence}</strong> happens. If you succeed, <strong>{successConsequence}</strong> happens!</p>
      <button onClick={logOut}>Log Out</button>
      <button onClick={() => setIsDeleteModalOpen(true)}>Reset & Start Over</button>
      
      <div className="delete-habit-modal-section">
        <DeleteHabitModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            deleteHabit();
            setIsDeleteModalOpen(false);
          }}
        />
      </div>
      
      <div className="commitment-date-section">
        <p>
          <strong>Commitment Date:</strong> {commitmentDate}
          {!hasEditedCommitmentDate && (
            <button
              onClick={handleEditDateClick}
              className="edit-date-button"
            >
              Edit Commitment Date
            </button>
          )}
        </p>

        {!hasEditedCommitmentDate && (
          <div className="edit-tooltip">
            You can only change this date once. After that, it's final.
          </div>
        )}

        {isEditingDate && (
          <div className="date-edit-container">
            <input
              type="date"
              value={newCommitmentDate}
              onChange={(e) => setNewCommitmentDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
            <button 
              onClick={() => setIsDateModalOpen(true)}
              className="save-date-button"
            >
              Save New Date
            </button>
            <button
              onClick={cancelDateEdit}
              className="cancel-date-button"
            >
              Cancel
            </button>
          </div>
        )}
        
        <DateEditModal
          isOpen={isDateEditModalOpen}
          onConfirm={confirmDateEdit}
          onCancel={cancelDateEdit}
        />
      </div>
    </>
  );
}

export default HabitDisplay;