import { useRouter } from "next/router";
import { useEffect } from "react";

export const useUpdateQueryString = (
    getNewSearchParams: (params: URLSearchParams) => URLSearchParams
) => {
    const router = useRouter();

    useEffect(() => {
        const url = new URL(window.location.href);
        const oldQueryString = url.searchParams.toString();
        const searchParams = new URLSearchParams(url.searchParams);
        const newQueryString = getNewSearchParams(searchParams).toString();

        if (oldQueryString !== newQueryString) {
            router.push(
                oldQueryString
                    ? url.pathname.replace(oldQueryString, newQueryString)
                    : `${url.pathname}?${newQueryString}`
            );
        }
    }, [getNewSearchParams, router]);
};
