import React from 'react';
import DeleteHabitModal from 'src/ui/modals/DeleteHabitModal';

type HabitDisplayProps = {
  name: string;
  trackingHabit: string;
  frequency: string;
  commitmentDate: string;
  failureConsequenceType: 'app' | 'partner' | null;
  partnerIsVerified: null | boolean;
  penaltyAmount: number | '' | null
  successConsequence: string;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (value: boolean) => void;
  deleteHabit: () => void;
  setIsDateEditModalOpen: (value: boolean) => void;
  hasEditedCommitmentDate: boolean;
  handleEditDateClick: () => void;
  isEditingDate: boolean;
  newCommitmentDate: string;
  setNewCommitmentDate: (value: string) => void;
  isDateEditModalOpen: boolean;
  confirmDateEdit: () => void;
  cancelDateEdit: () => void;
  logOut: () => void;

}

function HabitDisplay({ 
  name, 
  trackingHabit, 
  frequency, 
  commitmentDate,
  failureConsequenceType,
  partnerIsVerified,
  penaltyAmount,
  successConsequence,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  deleteHabit,
  setIsDateEditModalOpen,
  hasEditedCommitmentDate,
  handleEditDateClick,
  isEditingDate,
  newCommitmentDate,
  setNewCommitmentDate,
  isDateEditModalOpen,
  confirmDateEdit,
  cancelDateEdit,
  logOut
}: HabitDisplayProps) {
  return (
    <>
      <h2>Your Habit Tracker</h2>
      <p><strong>{name}</strong> is tracking <strong>{trackingHabit}</strong> with a frequency of <strong>{frequency}</strong>, until <strong>{commitmentDate}</strong>.</p>
      <p>If you fail, <strong>you need to pay your friend or the app money</strong>. If you succeed, <strong>{successConsequence}</strong> happens!</p>
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
              onClick={confirmDateEdit}
              className="save-date-button"
            >
              Save New Date
            </button>
            <button
              onClick={cancelDateEdit}
              className="cancel-date-button"
            >
              No, Keep It!
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default HabitDisplay;