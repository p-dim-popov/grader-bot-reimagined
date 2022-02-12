import { GetServerSideProps } from "next";
import React from "react";

interface IProps {
    code: number | string;
    message: string | null;
}

const ErrorPage: React.FC<IProps> = ({ code, message }) => {
    return (
        <div className="flex h-1/2 w-full flex-col items-center justify-center">
            <h3>{code}</h3>
            {message}
        </div>
    );
};

export default ErrorPage;

export const getServerSideProps: GetServerSideProps<IProps> = async (
    context
) => {
    const code = Number(context.params?.code);
    const url = new URL(context.req.url ?? "", "https://example.com");
    const message =
        url.pathname === `/error/${code}`
            ? null
            : ((context.query.message ?? null) as string | null);

    return {
        props: {
            code,
            message,
        },
    };
};
