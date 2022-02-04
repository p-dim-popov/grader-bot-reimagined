import { AuthUser } from '@/models/AuthUser';
import { getAxios } from '@/utils';

export const fetchUser = async (): Promise<AuthUser> => {
  const user = await getAxios().get<AuthUser>('/auth/profile');
  return user.data;
};
