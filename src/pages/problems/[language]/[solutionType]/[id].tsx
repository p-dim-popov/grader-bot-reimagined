import { Button } from "antd";
import Axios from "axios";
import { GetServerSideProps } from "next";
import React from "react";

import Hideable from "@/components/Hideable";
import Seo from "@/components/Seo";

import { Problem } from "@/models/Problem";
import { useAppSelector } from "@/redux";
import { getIsLoggedIn } from "@/redux/selectors";
import { fetchProblemById } from "@/services/problems.service";
import { runCatchingAsync } from "@/utils";

interface IProblemIdPageProps {
    problem: Problem;
}

const ProblemIdPage: React.FC<IProblemIdPageProps> = ({ problem }) => {
    const isLoggedIn = useAppSelector(getIsLoggedIn);

    return (
        <>
            <Seo />

            <div className="flex flex-col space-y-4">
                <h2>{problem.title}</h2>
                <p>{problem.description}</p>
                <textarea className="w-full" name="x" id="x" />
                <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:space-y-0">
                    <Button type="primary">Try</Button>
                    <Hideable isVisible={isLoggedIn}>
                        <Button type="primary" danger>
                            Submit
                        </Button>
                    </Hideable>
                </div>
            </div>
        </>
    );
};

export default ProblemIdPage;

export const getServerSideProps: GetServerSideProps<
    IProblemIdPageProps
> = async (context) => {
    const id = context.query.id as string;
    const [problem, error] = await runCatchingAsync(fetchProblemById(id));

    if (problem) {
        return {
            props: {
                problem,
            },
        };
    }

    if (Axios.isAxiosError(error)) {
        return {
            redirect: {
                destination: "/404",
            },
            props: {
                problem: {} as any,
            },
        };
    }

    return {
        props: {
            problem: {} as any,
        },
    };
};
