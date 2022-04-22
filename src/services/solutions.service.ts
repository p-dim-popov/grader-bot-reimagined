import { Pagination } from "@/interfaces";
import { BriefProblemTypeDescription } from "@/models/ProblemTypeDescription";
import { SolutionAttempt } from "@/models/SolutionAttempt";
import { SolutionResponse } from "@/models/SolutionResponse";
import { getAxios } from "@/utils";

export const submitSolution =
    (id: string, body: string, shouldSave: boolean) => async () => {
        const fd = new FormData();
        fd.append("source", new Blob([body], { type: "text/plain" }));
        fd.append("shouldSaveResult", String(shouldSave));

        const response = await getAxios().post<{
            id: string;
            attempts: SolutionAttempt[];
        }>(`/problems/${id}/solutions`, fd);

        return response.data;
    };

export const fetchSolutionById = (id: string) => async () => {
    const response = await getAxios().get<SolutionResponse>(`/solutions/${id}`);

    return response.data;
};

export const fetchSolutions = (
    init: {
        problemType?: BriefProblemTypeDescription;
        pagination?: Pagination;
        authors?: string[];
        problemAuthors?: string[];
        problemId?: string;
    } = {}
) => ({
    withPagination: (page: number, pageSize = 10) =>
        fetchSolutions({
            ...init,
            pagination: { page, pageSize },
        }),
    withProblemType: (programmingLanguage: string, solutionType: string) =>
        fetchSolutions({
            ...init,
            problemType: {
                programmingLanguage,
                solutionType,
            },
        }),
    withAuthors: (authors: string[] | string) =>
        fetchSolutions({
            ...init,
            authors: [authors].flat(),
        }),
    withProblemAuthors: (problemAuthors: string[]) =>
        fetchSolutions({
            ...init,
            problemAuthors,
        }),
    withProblemId: (problemId: string) =>
        fetchSolutions({
            ...init,
            problemId,
        }),
    build: () => {
        const params = new URLSearchParams();

        if (init.problemType) {
            params.append(
                "TypeDescription.ProgrammingLanguage",
                init.problemType.programmingLanguage
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

        if (init.authors) {
            init.authors.forEach((a) =>
                params.append("Filters.AuthorsEmails", a)
            );
        }

        if (init.problemId) {
            params.set("Filters.ProblemId", init.problemId);
        }

        return async () => {
            const response = await getAxios().get("/solutions", { params });
            return response.data;
        };
    },
});
