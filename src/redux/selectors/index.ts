import { AppState } from '@/redux/store';

export const getIsLoggedIn = (state: AppState) => Boolean(state.auth.user);
