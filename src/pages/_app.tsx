import App, { AppProps } from "next/app";
import React, { useEffect } from "react";
import "@/utils/noop";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import AppLayout from "@/components/layout/AppLayout";

import { Cookie } from "@/constants";
import { SetAuthUserAction, SetMostRecentProblemAction } from "@/redux/actions";
import { wrapper } from "@/redux/store";
import { fetchMostRecentProblemType } from "@/services/problems.service";
import { fetchUser } from "@/services/users.service";
import {
    clearAuthCookie,
    getAxios,
    getDecodedJwt,
    getDefaultCookieOptions,
    runCatchingAsync,
    setCookie,
} from "@/utils";

interface IAppProps {
    lastRanInBrowser: boolean;
    jwt: string;
}

const WrappedApp = wrapper.withRedux((({ Component, pageProps }) => {
    useEffect(() => {
        if (!pageProps.lastRanInBrowser) {
            const axios = getAxios();
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${pageProps.jwt}`;
        }
    }, [pageProps.jwt, pageProps.lastRanInBrowser]);
    return (
        <AppLayout>
            <Component {...pageProps} />
        </AppLayout>
    );
}) as React.FC<AppProps<IAppProps>>);

WrappedApp.getInitialProps = wrapper.getInitialAppProps<IAppProps>(
    (store) => async (context) => {
        console.log("_app/getInitialProps");
        const ctx = context.ctx;
        const [initialPageProps = {}] = await runCatchingAsync(() =>
            App.getInitialProps(context).then((x) => x.pageProps)
        );

        if (typeof window !== "undefined") {
            return {
                pageProps: {
                    ...initialPageProps,
                    lastRanInBrowser: true,
                },
            };
        }

        const jwt = (ctx.req as any).cookies.access_token as string;

        const tokenData = getDecodedJwt(jwt);
        getAxios().defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

        clearAuthCookie(ctx.res);
        if (tokenData) {
            const [user] = await runCatchingAsync(fetchUser);

            if (user) {
                store.dispatch(SetAuthUserAction.create(user));
                setCookie(
                    ctx.res,
                    Cookie.Jwt,
                    jwt,
                    getDefaultCookieOptions({
                        maxAge: tokenData.exp - Date.now() / 1000,
                    })
                );
            }
        }

        const mostRecentProblem = await fetchMostRecentProblemType();
        store.dispatch(SetMostRecentProblemAction.create(mostRecentProblem));

        return {
            pageProps: {
                ...initialPageProps,
                lastRanInBrowser: false,
                jwt,
            },
        };
    }
);

export default WrappedApp;
