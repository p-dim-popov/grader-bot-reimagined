import { ProblemTypeDescription } from "@/models/ProblemTypeDescription";

export interface Problem {
    id: string;
    title: string;
    description: string;
    type: ProblemTypeDescription;
    authorEmail: string;
}
