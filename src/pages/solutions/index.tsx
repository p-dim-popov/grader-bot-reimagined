import Axios from "axios";
import React from "react";

import SimpleLinkCard from "@/components/SimpleLinkCard";

import { getIsLoggedIn } from "@/redux/selectors";
import { wrapper } from "@/redux/store";
import { fetchSolutions } from "@/services/solutions.service";
import {
    createAuthRedirectObject,
    createAxiosErrorRedirectObject,
    runCatchingAsync,
} from "@/utils";
import withErrorHandler from "@/utils/withErrorHandler";

interface IProps {
    solutions: any[];
}

const SolutionsListPage: React.FC<IProps> = ({ solutions }) => {
    return (
        <>
            {solutions.map((x) => (
                <SimpleLinkCard
                    key={x.id}
                    href={`/solutions/${x.id}`}
                    title={x.problemTitle}
                    footer="TODO"
                />
            ))}
        </>
    );
};

export default withErrorHandler(SolutionsListPage);

export const getServerSideProps = wrapper.getServerSideProps<IProps>(
    (store) => async (context) => {
        const isLoggedIn = getIsLoggedIn(store.getState());
        if (!isLoggedIn) {
            return createAuthRedirectObject("/solutions");
        }

        let query = fetchSolutions();

        if (context.query.language && context.query.solutionType) {
            query = query.withProblemType(
                context.query.language as string,
                context.query.solutionType as string
            );
        }

        //TODO: pagination

        const [solutions, error] = await runCatchingAsync(query.build());

        if (Axios.isAxiosError(error)) {
            return createAxiosErrorRedirectObject(error);
        }

        return {
            props: {
                solutions,
            },
        };
    }
);
