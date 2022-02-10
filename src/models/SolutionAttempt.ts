interface BaseSolutionAttempt {
    output: string;
    correctOutput: string | null;
}

export interface SuccessSolutionAttempt extends BaseSolutionAttempt {
    correctOutput: null;
}

export interface ErrorSolutionAttempt extends BaseSolutionAttempt {
    correctOutput: string;
}

export type SolutionAttempt = SuccessSolutionAttempt | ErrorSolutionAttempt;
