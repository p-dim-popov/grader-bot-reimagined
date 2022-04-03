import { GetServerSideProps } from "next";
import React from "react";

import { ProblemForm } from "@/components/ProblemForm";
import Seo from "@/components/Seo";

import { SetAllProblemTypesAction } from "@/redux/actions";
import { isAuthUserInOneOfRoles } from "@/redux/selectors";
import { wrapper } from "@/redux/store";
import { fetchAllProblemTypes } from "@/services/problems.service";
import withErrorHandler, {
    createErrorRedirectObject,
} from "@/utils/withErrorHandler";

type Props = Record<string, never>;

const ProblemCreatePage: React.FC<Props> = () => {
    return (
        <>
            <Seo templateTitle="Create" />

            <ProblemForm />
        </>
    );
};

export default withErrorHandler(ProblemCreatePage);

export const getServerSideProps: GetServerSideProps<Props> =
    wrapper.getServerSideProps((store) => async (context) => {
        const state = store.getState();
        const isAdminOrModerator = isAuthUserInOneOfRoles(
            "Admin",
            "Moderator"
        )(state);

        if (!isAdminOrModerator) {
            return createErrorRedirectObject(403, "Not allowed");
        }

        const problemTypes = await fetchAllProblemTypes();
        store.dispatch(SetAllProblemTypesAction.create(problemTypes));

        return {
            props: {},
        };
    });
