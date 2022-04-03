import { Button } from "antd";
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
    downloadFile,
    runCatchingAsync,
} from "@/utils";
import withErrorHandler from "@/utils/withErrorHandler";

interface IProps {
    solution: SolutionResponse;
    downloadLink: string;
}

const SolutionIdPage: React.FC<IProps> = ({ solution, downloadLink }) => {
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
                    <Button
                        type="primary"
                        className="rounded-full border text-center lg:ml-2"
                        onClick={() => downloadFile(downloadLink)}
                    >
                        Download Solution
                    </Button>
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

        const id = context.params?.id as string;
        const [solution, error] = await runCatchingAsync(fetchSolutionById(id));

        const jwt = context.req.cookies.access_token as string;

        if (solution) {
            return {
                props: {
                    solution,
                    downloadLink: `/api/solutions/${id}/download?access_token=${jwt}`,
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
