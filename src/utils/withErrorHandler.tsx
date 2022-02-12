import { useRouter } from "next/router";
import * as React from "react";
import { useEffect } from "react";

import ErrorPage from "@/pages/error/[code]";

interface IProps {
    error?: {
        code: number | string;
        message: string | null;
    };
}

export default function withErrorHandler<TProps>(Component: React.FC<TProps>) {
    return ((props) => {
        const { error } = props;
        const router = useRouter();

        useEffect(() => {
            if (error) {
                const url = `/error/${error.code}`;

                if (error.message) {
                    router.replace(
                        `${url}?message=${encodeURIComponent(error.message)}`,
                        url
                    );
                } else {
                    router.replace(url);
                }
            }
        }, [error, router]);

        return error ? (
            <ErrorPage code={error.code} message={error.message} />
        ) : (
            <Component {...props} />
        );
    }) as React.FC<TProps & IProps>;
}

export const createErrorRedirectObject = (
    code: number | string,
    message?: string
) => {
    const props: IProps = {
        error: {
            code,
            message: message ?? null,
        },
    };

    return {
        props: props as any,
    };
};
