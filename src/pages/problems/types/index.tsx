import Link from "next/link";
import React from "react";

import Seo from "@/components/Seo";

import { useAppSelector } from "@/redux";
import { SetAllProblemTypesAction } from "@/redux/actions";
import { getProblemTypes } from "@/redux/selectors";
import { wrapper } from "@/redux/store";
import { fetchAllProblemTypes } from "@/services/problems.service";

const ProblemsListingPage: React.FC = () => {
    const list = useAppSelector(getProblemTypes);

    return (
        <>
            <Seo />

            {list?.map((x) => (
                <Link
                    href={`/problems/${x.language}/${x.solutionType}`}
                    key={`${x.language}/${x.solutionType}`}
                    passHref
                >
                    <a>
                        <div className="w-full max-w-sm lg:flex lg:max-w-full">
                            <div className="flex flex-col justify-between rounded-b border-r border-b border-l border-gray-400 bg-white p-4 leading-normal lg:rounded-b-none lg:rounded-r lg:border-l-0 lg:border-t lg:border-gray-400">
                                <div className="mb-8">
                                    <div className="mb-2 text-xl font-bold text-gray-900">
                                        {x.displayName}
                                    </div>
                                    <p className="text-base text-gray-700">
                                        {x.description}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-sm">
                                        <p className="leading-none text-gray-900">
                                            {x.language}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </Link>
            ))}
        </>
    );
};

export default ProblemsListingPage;

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (context) => {
        const problemTypes = await fetchAllProblemTypes();

        store.dispatch(SetAllProblemTypesAction.create(problemTypes));

        return {
            props: {},
        };
    }
);
