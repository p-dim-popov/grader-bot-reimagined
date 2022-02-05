import Axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";

import Seo from "@/components/Seo";
import SimpleLinkCard from "@/components/SimpleLinkCard";

import { Problem } from "@/models/Problem";
import { fetchAllProblemsOfType } from "@/services/problems.service";
import { runCatchingAsync } from "@/utils";

interface IProblemsListingPageProps {
    list: Problem[];
}

const ProblemsListingPage: React.FC<IProblemsListingPageProps> = ({ list }) => {
    const router = useRouter();

    return (
        <>
            <Seo />
            <div className="flex flex-row flex-wrap space-x-4">
                {list.map((x) => (
                    <SimpleLinkCard
                        key={x.id}
                        href={`/problems/${router.query.language}/${router.query.solutionType}/${x.id}`}
                        title={x.title}
                        description={x.description}
                        footer={`By: ${x.authorEmail}`}
                    />
                ))}
            </div>
        </>
    );
};
export default ProblemsListingPage;

export const getServerSideProps: GetServerSideProps<
    IProblemsListingPageProps
> = async (context) => {
    const [problems, error] = await runCatchingAsync(
        fetchAllProblemsOfType({
            language: context.params?.language as string,
            solutionType: context.params?.solutionType as string,
        })
    );

    if (problems) {
        return {
            props: {
                list: problems,
            },
        };
    }

    if (Axios.isAxiosError(error)) {
        return {
            redirect: {
                destination: "/404",
            },
            props: { list: [] },
        };
    }

    return {
        props: {
            list: [],
        },
    };
};
