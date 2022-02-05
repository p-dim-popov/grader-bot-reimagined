import { Problem } from "@/models/Problem";
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

export const fetchAllProblemsOfType = async (
    language: string,
    solutionType: string
) => {
    const response = await getAxios().get<Problem[]>(
        `/problems/${language}/${solutionType}`
    );
    return response.data;
};
