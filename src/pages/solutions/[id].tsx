import Axios from "axios";
import { useRouter } from "next/router";
import React from "react";

import Attempt from "@/components/Attempt";
import Hideable from "@/components/Hideable";
import UnstyledLink from "@/components/links/UnstyledLink";

import { SolutionResponse } from "@/models/SolutionResponse";
import { useAppSelector } from "@/redux";
import { getIsLoggedIn } from "@/redux/selectors";
import { wrapper } from "@/redux/store";
import { fetchSolutionById } from "@/services/solutions.service";
import {
    createAuthRedirectObject,
    createAxiosErrorRedirectObject,
    runCatchingAsync,
} from "@/utils";
import withErrorHandler from "@/utils/withErrorHandler";

interface IProps {
    solution: SolutionResponse;
}

const SolutionIdPage: React.FC<IProps> = ({ solution }) => {
    const router = useRouter();
    const authUser = useAppSelector((x) => x.auth.user);

    return (
        <>
            <h3>Solution for problem</h3>
            <div className="flex w-full flex-col lg:flex-row lg:items-center">
                <UnstyledLink href={`/problems/${solution.problemId}`}>
                    <h2>{solution.problemTitle}</h2>
                </UnstyledLink>
                <Hideable
                    isVisible={
                        authUser?.id &&
                        (authUser.id === solution.authorId ||
                            authUser.id === solution.problemAuthorId)
                    }
                >
                    <a
                        href={`/api/solutions/${router.query.id}/download`}
                        className="rounded-full border bg-blue-100 p-4 text-center lg:ml-2"
                    >
                        Download Solution
                    </a>
                </Hideable>
            </div>
            {solution.attempts.map((attempt, i) => (
                <div key={i} className="flex w-full flex-col space-y-10 pt-10">
                    <Attempt attempt={attempt} title={`#${i}`} />
                </div>
            ))}
        </>
    );
};

export default withErrorHandler(SolutionIdPage);

export const getServerSideProps = wrapper.getServerSideProps<IProps>(
    (store) => async (context) => {
        const isLoggedIn = getIsLoggedIn(store.getState());
        if (!isLoggedIn) {
            return createAuthRedirectObject(`/solutions/${context.params?.id}`);
        }

        const [solution, error] = await runCatchingAsync(
            fetchSolutionById(context.params?.id as string)
        );

        if (solution) {
            return {
                props: {
                    solution,
                },
            };
        }

        if (Axios.isAxiosError(error)) {
            return createAxiosErrorRedirectObject(error);
        }

        return {
            props: {
                solution: {} as any,
            },
        };
    }
);
