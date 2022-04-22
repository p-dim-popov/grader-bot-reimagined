import Axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import { QueryState, SearchBar } from "@/components/SearchBar";
import { SolutionLinkCard } from "@/components/SimpleLinkCard/variations/SolutionLinkCard";

import { Problem } from "@/models/Problem";
import { BriefProblemTypeDescription } from "@/models/ProblemTypeDescription";
import { SolutionListItemResponse } from "@/models/SolutionListItemResponse";
import { useAppSelector } from "@/redux";
import { SetAllProblemTypesAction } from "@/redux/actions";
import { getAuthUser, getProblemTypes } from "@/redux/selectors";
import { wrapper } from "@/redux/store";
import {
    fetchAllProblemTypes,
    fetchProblems,
} from "@/services/problems.service";
import { fetchSolutions } from "@/services/solutions.service";
import {
    createAuthRedirectObject,
    createAxiosErrorRedirectObject,
    runCatchingAsync,
} from "@/utils";
import { useUpdateQueryString } from "@/utils/useUpdateQueryString";
import withErrorHandler from "@/utils/withErrorHandler";

interface IProps {
    solutions: SolutionListItemResponse[];
    problems: Problem[];
}

const SolutionsListPage: React.FC<IProps> = ({ solutions, problems }) => {
    const problemTypes = useAppSelector(getProblemTypes);
    const router = useRouter();

    const user = useAppSelector(getAuthUser);
    const showAuthor = solutions.some((s) => s.authorEmail !== user?.email);

    const [filtersQuery, setFiltersQuery] = useState<QueryState>(() => ({
        emails: [router.query.authors].flat().filter(Boolean) as string[],
        problemType:
            typeof router.query.programmingLanguage === "string" &&
            typeof router.query.solutionType === "string"
                ? {
                      programmingLanguage: router.query.programmingLanguage,
                      solutionType: router.query.solutionType,
                  }
                : undefined,
        problemId: router.query.problemId as string,
    }));

    useUpdateQueryString(
        useCallback(
            (params) => {
                if (filtersQuery.problemId)
                    params.set("problemId", filtersQuery.problemId);
                else params.delete("problemId");

                if (filtersQuery.problemType) {
                    params.set(
                        "programmingLanguage",
                        filtersQuery.problemType.programmingLanguage
                    );
                    params.set(
                        "solutionType",
                        filtersQuery.problemType.solutionType
                    );
                } else {
                    params.delete("programmingLanguage");
                    params.delete("solutionType");
                }

                if (filtersQuery.emails) {
                    params.delete("authors");
                    filtersQuery.emails.forEach((e) =>
                        params.append("authors", e)
                    );
                } else params.delete("authors");

                return params;
            },
            [
                filtersQuery.emails,
                filtersQuery.problemId,
                filtersQuery.problemType,
            ]
        )
    );

    return (
        <>
            <SearchBar
                state={filtersQuery}
                setState={setFiltersQuery}
                problems={problems}
                problemTypes={problemTypes || undefined}
                showUsers
            />
            <div className="flex flex-row flex-wrap">
                {solutions.map((x) => (
                    <SolutionLinkCard
                        solution={x}
                        key={x.id}
                        showAuthor={showAuthor}
                    />
                ))}
            </div>
        </>
    );
};

export default withErrorHandler(SolutionsListPage);

export const getServerSideProps = wrapper.getServerSideProps<IProps>(
    (store) => async (context) => {
        const user = getAuthUser(store.getState());
        if (!user) {
            return createAuthRedirectObject("/solutions");
        }

        let solutionsQuery = fetchSolutions();
        let problemsQuery = fetchProblems();

        const problemType: BriefProblemTypeDescription | null =
            (context.query.programmingLanguage &&
                context.query.solutionType && {
                    programmingLanguage: context.query
                        .programmingLanguage as string,
                    solutionType: context.query.solutionType as string,
                }) ||
            null;

        if (problemType) {
            solutionsQuery = solutionsQuery.withProblemType(
                problemType.programmingLanguage,
                problemType.solutionType
            );
            problemsQuery = problemsQuery.withProblemType(
                problemType.programmingLanguage,
                problemType.solutionType
            );
        }

        if (typeof context.query.problemId === "string") {
            solutionsQuery = solutionsQuery.withProblemId(
                context.query.problemId
            );
        }

        if (context.query.authors) {
            solutionsQuery = solutionsQuery.withAuthors(context.query.authors);
        } else {
            solutionsQuery = solutionsQuery.withAuthors(`^${user.email}$`);
        }

        //TODO: pagination

        const [
            [solutions, solutionsError],
            [problems, problemsError],
            [problemTypes, problemTypesError],
        ] = await Promise.all(
            [
                solutionsQuery.build(),
                problemsQuery.build(),
                fetchAllProblemTypes,
            ].map(runCatchingAsync)
        );

        const errorToShow = [
            solutionsError,
            problemsError,
            problemTypesError,
        ].find(Axios.isAxiosError);
        if (errorToShow) {
            return createAxiosErrorRedirectObject(errorToShow);
        }

        store.dispatch(SetAllProblemTypesAction.create(problemTypes));

        return {
            props: {
                solutions,
                problems,
            },
        };
    }
);
