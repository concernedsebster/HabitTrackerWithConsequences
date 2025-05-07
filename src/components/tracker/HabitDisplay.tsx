import React from 'react';
import GiveUpModal from 'src/ui/modals/GiveUpModal';
import restartSameHabit from 'src/components/habit/HabitCheckIn';

type HabitDisplayProps = {
  name: string;
  habit: string;
  trackingHabit: string;
  frequency: string;
  commitmentDate: string;
  failureConsequenceType: 'app' | 'partner' | null;
  partnerIsVerified: null | boolean;
  penaltyAmount: number | '' | null
  successConsequence: string;
  isGiveUpModalOpen: boolean;
  setIsGiveUpModalOpen: (value: boolean) => void;
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
  hasUsedFreeFailure: boolean;
  restartSameHabit: () => void;

}

function HabitDisplay({ 
  name, 
  habit,
  trackingHabit, 
  frequency, 
  commitmentDate,
  failureConsequenceType,
  partnerIsVerified,
  penaltyAmount,
  successConsequence,
  isGiveUpModalOpen,
  setIsGiveUpModalOpen,
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
  logOut, 
  hasUsedFreeFailure,
  restartSameHabit
}: HabitDisplayProps) {
  return (
    <>
      <h2>Habit Details</h2>
        <ul>
            <li><strong>Habit:</strong> {habit}</li>
              <li><strong>Frequency:</strong> {frequency}</li>
            <li><strong>Until:</strong> {commitmentDate}</li> 
            <li><strong>Consequence if you fail:</strong> {(failureConsequenceType === 'partner') ? `Pay a friend ${penaltyAmount}.` : "Pay the app ${penaltyAmount}" }</li>
            <li><strong>Reward if successful:</strong> {successConsequence}</li>
        </ul>
      <button onClick={logOut}>Log Out</button>
      <button onClick={() => setIsGiveUpModalOpen(true)}>Reset & Start Over</button>
      
      <div className="delete-habit-modal-section">
        <GiveUpModal
          hasUsedFreeFailure={hasUsedFreeFailure}
          isOpen={isGiveUpModalOpen}
          onClose={() => setIsGiveUpModalOpen(false)}
          onConfirm={() => {
            restartSameHabit();
            setIsGiveUpModalOpen(false);
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