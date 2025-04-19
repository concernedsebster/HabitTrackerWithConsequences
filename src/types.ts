export type NewHabitPayload = {
    name: string;
    habit: string;
    frequency: string;
    commitmentDate: string;
    failureConsequenceType: "partner" | "app" | null;
    successConsequence: string;
    hasEditedCommitmentDate: boolean;
    penaltyAmount: number;
    partnerIsVerified: boolean;
    hasFailedBefore: boolean;
  };