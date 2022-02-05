import Axios, { AxiosRequestConfig } from "axios";
import { serialize as serializeCookie } from "cookie";
import jwt from "jsonwebtoken";

import { Cookie } from "@/constants";
import { clientAxios } from "@/utils/client-side";
import { defaultAxiosServerConfig, serverAxios } from "@/utils/server-side";

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

interface JwtContent {
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

    try {
        const data = jwt.decode(token);

        if (!data) return null;

        return data as JwtContent;
    } catch (error) {
        return null;
    }
}

export const runCatchingAsync = async <TResult>(
    func: () => Promise<TResult>
): Promise<[result: TResult, error?: unknown]> => {
    try {
        const result = await func();

        return [result];
    } catch (e) {
        // TODO: think of something...
        return [undefined!, e];
    }
};
