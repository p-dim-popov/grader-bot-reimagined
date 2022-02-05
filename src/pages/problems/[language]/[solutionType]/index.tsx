import Axios from "axios";
import { useRouter } from "next/router";
import React from "react";

import Seo from "@/components/Seo";
import SimpleLinkCard from "@/components/SimpleLinkCard";

import { Problem } from "@/models/Problem";
import { wrapper } from "@/redux/store";
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
                        footer={`By: ${x.author}`}
                    />
                ))}
            </div>
        </>
    );
};
export default ProblemsListingPage;

export const getServerSideProps =
    wrapper.getServerSideProps<IProblemsListingPageProps>(
        () => async (context) => {
            const [problems, error] = await runCatchingAsync(() =>
                fetchAllProblemsOfType(
                    context.params?.language as string,
                    context.params?.solutionType as string
                )
            );

            if (Axios.isAxiosError(error)) {
                // TODO: check status code
                return {
                    redirect: {
                        destination: "/404",
                    },
                    props: { list: [] },
                };
            }

            return {
                props: {
                    list: problems,
                },
            };
        }
    );
