import { Action } from 'redux';

import { AuthUser } from '@/models/AuthUser';

export const SetAuthUserAction = {
  type: 'SetAuthUserAction' as const,
  create: (user?: AuthUser): ISetAuthUserAction => ({
    type: SetAuthUserAction.type,
    payload: user ?? null,
  }),
};

export interface ISetAuthUserAction
  extends Action<typeof SetAuthUserAction.type> {
  payload: AuthUser | null;
}

export const FetchProfileRequestAction = {
  type: 'FetchProfileRequestAction' as const,
  create: (jwt: string): IFetchProfileRequestAction => ({
    type: FetchProfileRequestAction.type,
    payload: jwt,
  }),
};

export interface IFetchProfileRequestAction
  extends Action<typeof FetchProfileRequestAction.type> {
  payload: string;
}
