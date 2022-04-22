import React from "react";

import SimpleLinkCard from "@/components/SimpleLinkCard";

import { SolutionListItemResponse } from "@/models/SolutionListItemResponse";
import { useAppSelector } from "@/redux";
import { getAuthUser } from "@/redux/selectors";
import { getSuccessPercentage } from "@/utils";

type Props = {
    solution: SolutionListItemResponse;
    showAuthor?: boolean;
};

export const SolutionLinkCard: React.FC<Props> = ({
    solution: { id, attempts, problemType, problemTitle, authorEmail },
    showAuthor,
}) => {
    const user = useAppSelector(getAuthUser);
    const currentUserIsAuthor = user?.email === authorEmail;

    return (
        <SimpleLinkCard
            href={`/solutions/${id}`}
            description={`${getSuccessPercentage(attempts)}% solved${
                showAuthor
                    ? ` by ${currentUserIsAuthor ? "you" : authorEmail}`
                    : ""
            }`}
            title={problemTitle}
            footer={`${problemType.displayName} | ${problemType.description}`}
        />
    );
};
