import { AppState } from "@/redux/store";

export const getIsLoggedIn = (state: AppState) => Boolean(state.auth.user);

export const getProblemTypes = (state: AppState) => state.problems.types;
