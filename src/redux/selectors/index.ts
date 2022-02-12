import { AppState } from "@/redux/store";

const createAppSelector = <T>(selector: (state: AppState) => T) => selector;

export const getIsLoggedIn = createAppSelector((state) =>
    Boolean(state.auth.user)
);

export const getProblemTypes = createAppSelector(
    (state) => state.problems.types
);

export const getEditorTheme = createAppSelector(
    (state) => state.editor.config.theme
);
