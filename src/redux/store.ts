import { Context, createWrapper, HYDRATE, MakeStore } from 'next-redux-wrapper';
import { AnyAction, createStore, Store } from 'redux';

import { AuthUser } from '@/models/AuthUser';
import { ProblemTypeDescription } from '@/models/ProblemTypeDescription';
import {
  ISetAuthUserAction,
  ISetMostRecentProblemAction,
  SetAuthUserAction,
  SetMostRecentProblemAction,
} from '@/redux/actions';

export interface AppState {
  auth: {
    user: AuthUser | null;
  };
  common: {
    mostRecentProblem: ProblemTypeDescription;
  };
}

const initialState: AppState = {
  auth: {
    user: null,
  },
  common: {
    mostRecentProblem: null as any,
  },
};

type AppAction =
  | ISetAuthUserAction
  | ISetMostRecentProblemAction
  | { type: typeof HYDRATE; payload: AppState };

const reducer = (state: AppState = initialState, action: AppAction) => {
  switch (action.type) {
    case HYDRATE:
      return {
        ...state,
        // server-side auth is always correct
        auth: action.payload.auth,
        common: {
          ...state,
          // for now this is set only server side
          mostRecentProblem: action.payload.common.mostRecentProblem,
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
        common: {
          ...state.common,
          mostRecentProblem: action.payload,
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
