import Axios from "axios";
import { GetServerSideProps } from "next";
import React from "react";

import { ProblemForm } from "@/components/ProblemForm";
import Seo from "@/components/Seo";

import { Problem } from "@/models/Problem";
import { SetAllProblemTypesAction } from "@/redux/actions";
import { getAuthUser, isAuthUserInAllRoles } from "@/redux/selectors";
import { wrapper } from "@/redux/store";
import {
    fetchAllProblemTypes,
    fetchProblemById,
} from "@/services/problems.service";
import { createAxiosErrorRedirectObject, runCatchingAsync } from "@/utils";
import withErrorHandler, {
    createErrorRedirectObject,
} from "@/utils/withErrorHandler";

interface Props {
    problem: Problem;
}

const EditProblemPage: React.FC<Props> = ({ problem }) => {
    return (
        <>
            <Seo
                templateTitle={`Edit | ${problem.title}`}
                description={problem.description}
            />

            <ProblemForm problem={problem} />
        </>
    );
};

export default withErrorHandler(EditProblemPage);

export const getServerSideProps: GetServerSideProps<Props> =
    wrapper.getServerSideProps((store) => async (context) => {
        const id = context.query.id as string;
        const [problem, error] = await runCatchingAsync(fetchProblemById(id));

        if (Axios.isAxiosError(error)) {
            return createAxiosErrorRedirectObject(error);
        }

        if (!problem) {
            return createErrorRedirectObject(500, "Something went wrong");
        }

        const state = store.getState();
        const user = getAuthUser(state);
        const isAdmin = isAuthUserInAllRoles("Admin")(state);

        if (!isAdmin && user?.email !== problem.authorEmail) {
            return createErrorRedirectObject(403, "Not allowed");
        }

        const problemTypes = await fetchAllProblemTypes();
        store.dispatch(SetAllProblemTypesAction.create(problemTypes));

        return {
            props: {
                problem,
            },
        };
    });
