import { HumanReadableProblemTypeDescription } from "@/models/ProblemTypeDescription";
import { SolutionAttempt } from "@/models/SolutionAttempt";

export interface SolutionListItemResponse {
    id: string;
    problemType: HumanReadableProblemTypeDescription;
    problemId: string;
    problemTitle: string;
    createdOn: string;
    attempts: SolutionAttempt[];
}
