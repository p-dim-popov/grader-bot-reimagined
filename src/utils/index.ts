import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { serialize as serializeCookie } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

import { Cookie } from "@/constants";
import { clientAxios } from "@/utils/client-side";
import { defaultAxiosServerConfig, serverAxios } from "@/utils/server-side";
import { createErrorRedirectObject } from "@/utils/withErrorHandler";

export const getAxios = (config?: AxiosRequestConfig) => {
    const isServer = typeof window === "undefined";

    if (!config) {
        return isServer ? serverAxios : clientAxios;
    }

    return Axios.create({
        ...(isServer ? defaultAxiosServerConfig : defaultAxiosServerConfig),
        ...config,
    });
};

export function setCookie(
    res: any,
    name: string,
    value: string,
    options: Record<string, unknown> = {}
): void {
    const stringValue =
        typeof value === "object"
            ? `j:${JSON.stringify(value)}`
            : String(value);

    res.setHeader(
        "Set-Cookie",
        serializeCookie(name, String(stringValue), options)
    );
}

interface JwtContent extends JwtPayload {
    id: string;
    jti: string;
    role: string;
    nbf: number;
    exp: number;
    iat: number;
}

export const clearAuthCookie = (res: any): void => {
    setCookie(res, Cookie.Jwt, "0", {
        ...getDefaultCookieOptions(),
        maxAge: -1,
    });
};

export const getDefaultCookieOptions = (
    overrides: Record<string, unknown> = {}
) => ({
    httpOnly: true,
    path: "/",
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 2592000,
    ...overrides,
});

export function getDecodedJwt(
    token: string | null | undefined
): JwtContent | null {
    if (!token) return null;

    const [data, error] = runCatching(() => jwt.decode(token));

    if (!data || error) return null;

    return data as JwtContent;
}

export type IResult<TResult> =
    | [result: TResult, error: undefined]
    | [result: undefined, error: unknown];

export const runCatchingAsync = async <TResult>(
    func: () => Promise<TResult>
): Promise<IResult<TResult>> => {
    try {
        const result = await func();
        return [result, undefined];
    } catch (error) {
        return [undefined, error];
    }
};

export const runCatching = <TResult>(func: () => TResult): IResult<TResult> => {
    try {
        const result = func();
        return [result, undefined];
    } catch (error) {
        return [undefined, error];
    }
};

export const createAxiosErrorRedirectObject = (error: AxiosError) => {
    if (error.response) {
        return createErrorRedirectObject(
            error.response.status,
            error.response.statusText
        );
    }

    if (error.code) {
        return createErrorRedirectObject(error.code);
    }

    return createErrorRedirectObject(500);
};

export const createAuthRedirectObject = (
    backTo?: string,
    query?: URLSearchParams
) => {
    const url = "/auth/login";
    const backUrl = query ? `${backTo}${query.toString()}` : backTo;
    return {
        redirect: {
            destination: backUrl
                ? `${url}?backTo=${encodeURIComponent(backUrl)}`
                : url,
            permanent: false,
        },
        props: {},
    };
};
