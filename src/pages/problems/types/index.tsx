import { Button } from "antd";
import Link from "next/link";
import React from "react";

import Hideable from "@/components/Hideable";
import Seo from "@/components/Seo";
import SimpleLinkCard from "@/components/SimpleLinkCard";

import { useAppSelector } from "@/redux";
import { SetAllProblemTypesAction } from "@/redux/actions";
import { getProblemTypes, isAuthUserInOneOfRoles } from "@/redux/selectors";
import { wrapper } from "@/redux/store";
import { fetchAllProblemTypes } from "@/services/problems.service";

const ProblemsListingPage: React.FC = () => {
    const list = useAppSelector(getProblemTypes);
    const isAdminOrModerator = useAppSelector(
        isAuthUserInOneOfRoles("Admin", "Moderator")
    );

    return (
        <div className="flex h-full w-full flex-col space-y-2">
            <Seo />

            <Hideable isVisible={isAdminOrModerator}>
                <div className="self-center">
                    <Link href="/problems/create" passHref>
                        <Button type="primary">Create New Problem</Button>
                    </Link>
                </div>
            </Hideable>

            <div className="flex flex-row flex-wrap">
                {list?.map((x) => (
                    <SimpleLinkCard
                        href={`/${x.programmingLanguage}/${x.solutionType}/problems`}
                        key={`${x.programmingLanguage}/${x.solutionType}`}
                        title={x.displayName}
                        description={x.description}
                        footer={x.programmingLanguage}
                    />
                ))}
            </div>
        </div>
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
