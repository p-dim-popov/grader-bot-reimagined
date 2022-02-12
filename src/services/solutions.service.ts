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
