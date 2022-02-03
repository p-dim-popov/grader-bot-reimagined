import { Context, createWrapper, HYDRATE, MakeStore } from 'next-redux-wrapper';
import { AnyAction, createStore, Store } from 'redux';

import { AuthUser } from '@/models/AuthUser';
import { ISetAuthUserAction, SetAuthUserAction } from '@/redux/actions';

export interface AppState {
  auth: {
    user: AuthUser | null;
  };
}

const initialState: AppState = {
  auth: {
    user: null,
  },
};

type AppAction = ISetAuthUserAction | { type: typeof HYDRATE; payload: any };

const reducer = (state: AppState = initialState, action: AppAction) => {
  switch (action.type) {
    case HYDRATE:
      return {
        ...state,
        // server-side auth is always correct
        auth: action.payload.auth,
      };
    case SetAuthUserAction.type:
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload,
        },
      };
    default:
      return state;
  }
};

const makeStore: MakeStore<Store<AppState, AnyAction>> = (context: Context) =>
  createStore(reducer);

export const wrapper = createWrapper<Store<AppState>>(makeStore, {
  debug: true,
});
