import { SolutionAttempt } from "@/models/SolutionAttempt";

export interface SolutionResponse {
    problemId: string;
    problemTitle: string;
    attempts: SolutionAttempt[];
    authorId: string;
    problemAuthorId: string;
}
