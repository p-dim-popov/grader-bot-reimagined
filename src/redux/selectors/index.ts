import { AppState } from "@/redux/store";

const createAppSelector = <T>(selector: (state: AppState) => T) => selector;

export const getAuthUser = createAppSelector((state) => state.auth.user);

export const getIsLoggedIn = createAppSelector((state) =>
    Boolean(getAuthUser(state))
);

export const getProblemTypes = createAppSelector(
    (state) => state.problems.types
);

export const getEditorTheme = createAppSelector(
    (state) => state.editor.config.theme
);

export const getAuthUserRoles = createAppSelector(
    (state) => getAuthUser(state)?.roles ?? []
);

export const isAuthUserInAllRoles = (...roles: string[]) =>
    createAppSelector((state) => {
        const userRoles = getAuthUserRoles(state);
        if (!userRoles.length) return false;

        return roles.every((role) => userRoles.includes(role));
    });

export const isAuthUserInOneOfRoles = (...roles: string[]) =>
    createAppSelector((state) => {
        const userRoles = getAuthUserRoles(state);
        if (!userRoles.length) return false;

        return roles.some((role) => userRoles.includes(role));
    });
