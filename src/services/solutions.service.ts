import { Pagination } from "@/interfaces";
import { ProblemTypeDescription } from "@/models/ProblemTypeDescription";
import { SolutionAttempt } from "@/models/SolutionAttempt";
import { SolutionResponse } from "@/models/SolutionResponse";
import { getAxios } from "@/utils";

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

export const fetchSolutionById = (id: string) => async () => {
    const response = await getAxios().get<SolutionResponse>(`/solutions/${id}`);

    return response.data;
};

export const fetchSolutions = (
    init: {
        problemType?: Pick<ProblemTypeDescription, "language" | "solutionType">;
        pagination?: Pagination;
    } = {}
) => ({
    withPagination: (page: number, pageSize = 10) =>
        fetchSolutions({
            ...init,
            pagination: { page, pageSize },
        }),
    withProblemType: (language: string, solutionType: string) =>
        fetchSolutions({
            ...init,
            problemType: {
                language,
                solutionType,
            },
        }),
    build: () => {
        const params = new URLSearchParams();

        if (init.problemType) {
            params.append(
                "TypeDescription.ProgrammingLanguage",
                init.problemType.language
            );
            params.append(
                "TypeDescription.SolutionType",
                init.problemType.solutionType
            );
        }

        if (init.pagination) {
            params.append("Pagination.Page", init.pagination.page.toString());
            params.append(
                "Pagination.PageSize",
                init.pagination.pageSize.toString()
            );
        }

        return async () => {
            const response = await getAxios().get("/solutions", { params });
            return response.data;
        };
    },
});
