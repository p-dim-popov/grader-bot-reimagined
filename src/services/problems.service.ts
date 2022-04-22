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

export const fetchProblems = (
    init: {
        problemType?: BriefProblemTypeDescription;
        authors?: string[];
    } = {}
) => ({
    withProblemType: (programmingLanguage: string, solutionType: string) =>
        fetchProblems({
            ...init,
            problemType: {
                programmingLanguage,
                solutionType,
            },
        }),
    withAuthors: (authors: string[]) =>
        fetchProblems({
            ...init,
            authors,
        }),
    build: () => {
        return async () => {
            const params = new URLSearchParams();

            if (init.problemType) {
                params.set(
                    "ProblemType.ProgrammingLanguage",
                    init.problemType.programmingLanguage
                );
                params.set(
                    "ProblemType.SolutionType",
                    init.problemType.solutionType
                );
            }

            if (init.authors) {
                init.authors.forEach((a) => params.append("Authors", a));
            }

            const response = await getAxios().get<Problem[]>(`/problems`, {
                params,
            });
            return response.data;
        };
    },
});

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
