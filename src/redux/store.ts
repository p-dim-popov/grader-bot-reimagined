import { Context, createWrapper, HYDRATE, MakeStore } from "next-redux-wrapper";
import { createStore, Store } from "redux";

import { AuthUser } from "@/models/AuthUser";
import { ProblemTypeDescription } from "@/models/ProblemTypeDescription";
import {
    SetAllProblemTypesAction,
    SetAuthUserAction,
    SetEditorThemeAction,
    SetMostRecentProblemAction,
} from "@/redux/actions";

export interface AppState {
    auth: {
        user: AuthUser | null;
    };
    problems: {
        mostRecent: ProblemTypeDescription;
        types: ProblemTypeDescription[] | null;
    };
    editor: {
        config: {
            theme: "light" | "vs-dark";
        };
    };
}

const initialState: AppState = {
    auth: {
        user: null,
    },
    problems: {
        mostRecent: null as any,
        types: null,
    },
    editor: {
        config: {
            theme: "vs-dark",
        },
    },
};

type AppAction =
    | ReturnType<typeof SetAuthUserAction.create>
    | ReturnType<typeof SetMostRecentProblemAction.create>
    | ReturnType<typeof SetAllProblemTypesAction.create>
    | ReturnType<typeof SetEditorThemeAction.create>
    | { type: typeof HYDRATE; payload: AppState };

const reducer = (
    state: AppState = initialState,
    action: AppAction
): AppState => {
    switch (action.type) {
        case HYDRATE:
            return {
                ...state,
                // server-side auth is always correct
                auth: action.payload.auth,
                problems: {
                    ...state.problems,
                    mostRecent:
                        action.payload.problems.mostRecent ??
                        state.problems.mostRecent,
                    types:
                        action.payload.problems.types ?? state.problems.types,
                },
            };
        case SetAuthUserAction.type:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    user: action.payload,
                },
            };
        case SetMostRecentProblemAction.type:
            return {
                ...state,
                problems: {
                    ...state.problems,
                    mostRecent: action.payload,
                },
            };
        case SetAllProblemTypesAction.type:
            return {
                ...state,
                problems: {
                    ...state.problems,
                    types: action.payload,
                },
            };
        case SetEditorThemeAction.type:
            return {
                ...state,
                editor: {
                    ...state.editor,
                    config: {
                        ...state.editor.config,
                        theme: action.payload,
                    },
                },
            };
        default:
            return state;
    }
};

const makeStore: MakeStore<Store<AppState>> = (context: Context) =>
    createStore(reducer);

export const wrapper = createWrapper<Store<AppState>>(makeStore, {
    debug: false,
});
