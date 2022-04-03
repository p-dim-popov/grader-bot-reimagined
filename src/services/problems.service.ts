import { Problem } from "@/models/Problem";
import {
    BriefProblemTypeDescription,
    ProblemTypeDescription,
} from "@/models/ProblemTypeDescription";
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
    ({ programmingLanguage, solutionType }: BriefProblemTypeDescription) =>
    async () => {
        const response = await getAxios().get<Problem[]>(
            `/${programmingLanguage}/${solutionType}/problems`
        );
        return response.data;
    };

export const fetchProblemById = (id: string) => async () => {
    const response = await getAxios().get<Problem>(`/problems/${id}`);

    return response.data;
};

export const editOrCreateProblem =
    (problemType: BriefProblemTypeDescription, form: FormData) => async () => {
        const method = form.has("Id") ? "patch" : "post";
        const response = await getAxios()[method](
            `/${problemType.programmingLanguage}/${problemType.solutionType}/problems`,
            form
        );

        return response.data;
    };
