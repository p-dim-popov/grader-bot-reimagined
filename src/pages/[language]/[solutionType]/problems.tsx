import Axios from "axios";
import { GetServerSideProps } from "next";
import React from "react";

import Seo from "@/components/Seo";
import SimpleLinkCard from "@/components/SimpleLinkCard";

import { Problem } from "@/models/Problem";
import { fetchAllProblemsOfType } from "@/services/problems.service";
import { createAxiosErrorRedirectObject, runCatchingAsync } from "@/utils";
import withErrorHandler from "@/utils/withErrorHandler";

interface IProblemsListingPageProps {
    list: Problem[];
}

const ProblemsListingPage: React.FC<IProblemsListingPageProps> = ({ list }) => {
    return (
        <>
            <Seo />
            <div className="flex flex-row flex-wrap space-x-4">
                {list.map((x) => (
                    <SimpleLinkCard
                        key={x.id}
                        href={`/problems/${x.id}`}
                        title={x.title}
                        description={x.description}
                        footer={`By: ${x.authorEmail}`}
                    />
                ))}
            </div>
        </>
    );
};
export default withErrorHandler(ProblemsListingPage);

export const getServerSideProps: GetServerSideProps<
    IProblemsListingPageProps
> = async (context) => {
    const [problems, error] = await runCatchingAsync(
        fetchAllProblemsOfType({
            programmingLanguage: context.params?.language as string,
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
        return createAxiosErrorRedirectObject(error);
    }

    return {
        props: {
            list: [],
        },
    };
};
