import { Action } from "redux";

import { AuthUser } from "@/models/AuthUser";
import { ProblemTypeDescription } from "@/models/ProblemTypeDescription";

export const SetAuthUserAction = {
    type: "SetAuthUserAction" as const,
    create: (user?: AuthUser): ISetAuthUserAction => ({
        type: SetAuthUserAction.type,
        payload: user ?? null,
    }),
};

export interface ISetAuthUserAction
    extends Action<typeof SetAuthUserAction.type> {
    payload: AuthUser | null;
}

export const SetMostRecentProblemAction = {
    type: "SetMostRecentProblemAction" as const,
    create: (problem: ProblemTypeDescription): ISetMostRecentProblemAction => ({
        type: SetMostRecentProblemAction.type,
        payload: problem,
    }),
};

export interface ISetMostRecentProblemAction
    extends Action<typeof SetMostRecentProblemAction.type> {
    payload: ProblemTypeDescription;
}

export const SetAllProblemTypesAction = {
    type: "SetAllProblemTypesAction" as const,
    create: (
        allProblemTypes: ProblemTypeDescription[]
    ): ISetAllProblemTypesAction => ({
        type: SetAllProblemTypesAction.type,
        payload: allProblemTypes,
    }),
};

export interface ISetAllProblemTypesAction
    extends Action<typeof SetAllProblemTypesAction.type> {
    payload: ProblemTypeDescription[];
}
