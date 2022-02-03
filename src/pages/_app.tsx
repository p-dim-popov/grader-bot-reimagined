import axios from 'axios';
import { AppProps } from 'next/app';
import React from 'react';

import '@/styles/globals.css';

import AppLayout from '@/components/layout/AppLayout';

import { Cookie } from '@/constants';
import { SetAuthUserAction } from '@/redux/actions';
import { wrapper } from '@/redux/store';
import { fetchUser } from '@/services/users.service';
import { getDecodedJwt, getDefaultCookieOptions, setCookie } from '@/utils';

axios.defaults.baseURL = '/api';

const WrappedApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
};

(WrappedApp as any).getInitialProps = wrapper.getInitialPageProps(
  (store) => async (ctx) => {
    const context = (ctx as any).ctx;

    console.debug('_app/getInitialProps');

    if (typeof window !== 'undefined') {
      return { lastRanInBrowser: true };
    }

    const clearAuthCookie = (): void => {
      setCookie(context.res, Cookie.Jwt, '0', {
        ...getDefaultCookieOptions(),
        maxAge: -1,
      });
    };

    const tokenData = getDecodedJwt(context.req.cookies.access_token);
    clearAuthCookie();
    if (tokenData) {
      try {
        const user = await fetchUser(context.req.cookies.access_token)();

        store.dispatch(SetAuthUserAction.create(user));
        setCookie(
          context.res,
          Cookie.Jwt,
          context.req.cookies.access_token,
          getDefaultCookieOptions({ maxAge: tokenData.exp - Date.now() / 1000 })
        );
      } catch (e) {
        console.error(e);
      }
    }

    return { lastRanInBrowser: false };
  }
);

export default wrapper.withRedux(WrappedApp);
