import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Storage } from '@/constants';
import { SetAuthUserAction } from '@/redux/actions';

const Logout: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    sessionStorage.removeItem(Storage.Jwt);
    localStorage.removeItem(Storage.Jwt);
    dispatch(SetAuthUserAction.create());
    router.push('/');
  }, []);

  return <></>;
};

export default Logout;
