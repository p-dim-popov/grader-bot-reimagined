import { Problem } from "@/models/Problem";
import { ProblemType } from "@/models/ProblemType";
import { ProblemTypeDescription } from "@/models/ProblemTypeDescription";
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
