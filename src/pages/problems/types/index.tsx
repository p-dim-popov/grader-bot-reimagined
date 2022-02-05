import React from "react";

import Seo from "@/components/Seo";
import SimpleLinkCard from "@/components/SimpleLinkCard";

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
                <SimpleLinkCard
                    href={`/problems/${x.language}/${x.solutionType}`}
                    key={`${x.language}/${x.solutionType}`}
                    title={x.displayName}
                    description={x.description}
                    footer={x.language}
                />
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
