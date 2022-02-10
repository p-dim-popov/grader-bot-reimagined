import { AuthUser } from "@/models/AuthUser";
import { ProblemTypeDescription } from "@/models/ProblemTypeDescription";

const createAction =
    <TType>(typeValue: TType) =>
    <TAction extends (...args: any[]) => any>(action: TAction) => ({
        type: typeValue,
        create: (...args: Parameters<typeof action>) => {
            const payload: ReturnType<typeof action> = action(...args);
            return {
                type: typeValue,
                payload,
            };
        },
    });

export const SetAuthUserAction = createAction("SetAuthUserAction" as const)(
    (user?: AuthUser) => user ?? null
);

export const SetMostRecentProblemAction = createAction(
    "SetMostRecentProblemAction" as const
)((problem: ProblemTypeDescription) => problem);

export const SetAllProblemTypesAction = createAction(
    "SetAllProblemTypesAction" as const
)((allProblemTypes: ProblemTypeDescription[]) => allProblemTypes);

export const SetEditorThemeAction = createAction(
    "SetEditorThemeAction" as const
)((theme: "light" | "vs-dark") => theme);
