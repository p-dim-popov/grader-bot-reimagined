import { Problem } from "@/models/Problem";
import { ProblemType } from "@/models/ProblemType";
import { ProblemTypeDescription } from "@/models/ProblemTypeDescription";
import { SolutionAttempt } from "@/models/SolutionAttempt";
import { getAxios } from "@/utils";

export const fetchMostRecentProblemType = async () => {
    const response = await getAxios().get<ProblemTypeDescription>(
        "/problems/types/most-recent"
    );
    return response.data;
};

export const fetchAllProblemTypes = async () => {
    const response = await getAxios().get<ProblemTypeDescription[]>(
        "/problems/types"
    );
    return response.data;
};

export const fetchAllProblemsOfType =
    ({ language, solutionType }: ProblemType) =>
    async () => {
        const response = await getAxios().get<Problem[]>(
            `/${language}/${solutionType}/problems`
        );
        return response.data;
    };

export const fetchProblemById = (id: string) => async () => {
    const response = await getAxios().get(`/problems/${id}`);

    return response.data;
};

export const submitSolution =
    (id: string, body: string, shouldSave: boolean) => async () => {
        const fd = new FormData();
        fd.append("source", new Blob([body], { type: "text/plain" }));
        fd.append("shouldSave", String(shouldSave));

        const response = await getAxios().post<SolutionAttempt[]>(
            `/problems/${id}/solutions`,
            fd
        );

        return response.data;
    };
