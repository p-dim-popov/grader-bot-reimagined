export type BriefProblemTypeDescription = {
    programmingLanguage: string;
    solutionType: string;
};

export type HumanReadableProblemTypeDescription = {
    displayName: string;
    description: string;
};

export type ProblemTypeDescription = BriefProblemTypeDescription &
    HumanReadableProblemTypeDescription;
