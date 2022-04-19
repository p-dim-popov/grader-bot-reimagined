import { Button } from "antd";
import Axios from "axios";
import Link from "next/link";
import React from "react";

import Attempt from "@/components/Attempt";
import Hideable from "@/components/Hideable";

import { SolutionResponse } from "@/models/SolutionResponse";
import { useAppSelector } from "@/redux";
import { getIsLoggedIn, isAuthUserInOneOfRoles } from "@/redux/selectors";
import { wrapper } from "@/redux/store";
import { fetchSolutionById } from "@/services/solutions.service";
import {
    createAuthRedirectObject,
    createAxiosErrorRedirectObject,
    downloadFile,
    getSuccessPercentage,
    runCatchingAsync,
} from "@/utils";
import withErrorHandler from "@/utils/withErrorHandler";

interface IProps {
    solution: SolutionResponse;
    downloadLink: string;
}

const SolutionIdPage: React.FC<IProps> = ({ solution, downloadLink }) => {
    const authUser = useAppSelector((x) => x.auth.user);
    const isAdmin = useAppSelector(isAuthUserInOneOfRoles("Admin"));
    const isCreator = authUser?.id === solution.problemAuthorId;
    const isOwner = authUser?.id === solution.authorId;

    return (
        <div className="w-full">
            <h3>Solution for problem</h3>
            <div className="flex w-full flex-col pb-4 lg:flex-row lg:items-center">
                <div className="flex h-12 flex-row items-center">
                    {">"}
                    <Link href={`/problems/${solution.problemId}`} passHref>
                        <Button type="link">
                            <h2>{solution.problemTitle}</h2>
                        </Button>
                    </Link>
                </div>
                <Hideable isVisible={isOwner || isCreator || isAdmin}>
                    <Button
                        type="primary"
                        className="w-60 rounded-full border text-center lg:ml-2"
                        onClick={() => downloadFile(downloadLink)}
                    >
                        Download Solution
                    </Button>
                </Hideable>
            </div>
            <h4>
                {solution.attempts.length} cases,{" "}
                {getSuccessPercentage(solution.attempts)}% Success
            </h4>
            {solution.attempts.map((attempt, i) => (
                <div key={i} className="flex w-full flex-col pt-4">
                    <Attempt attempt={attempt} title={`#${i}`} />
                </div>
            ))}
        </div>
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
