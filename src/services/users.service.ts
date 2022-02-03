import { AuthUser } from '@/models/AuthUser';
import { getAxios } from '@/utils';

export const fetchUser = (token: string) => async (): Promise<AuthUser> => {
  const user = await getAxios({
    headers: { Authorization: `Bearer ${token}` },
  }).get<AuthUser>('/auth/profile');
  return user.data;
};
