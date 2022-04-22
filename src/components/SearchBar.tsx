import { Button, Cascader, Input, Tag } from "antd";
import classNames from "classnames";
import React, { ChangeEvent, useCallback, useState } from "react";
import { toast } from "react-toastify";

import Hideable from "@/components/Hideable";

import { Problem } from "@/models/Problem";
import {
    BriefProblemTypeDescription,
    ProblemTypeDescription,
} from "@/models/ProblemTypeDescription";
import { cascaderSearchFilter, runCatching } from "@/utils";

export type QueryState = {
    emails?: string[];
    problemId?: string;
    problemType?: BriefProblemTypeDescription;
};

type Props = {
    state: QueryState;
    setState: React.Dispatch<React.SetStateAction<QueryState>>;
    showUsers?: boolean;
    problemTypes?: ProblemTypeDescription[];
    problems?: Problem[];
    className?: string;
};

export const SearchBar: React.FC<Props> = ({
    state,
    setState,
    problems,
    showUsers,
    problemTypes,
    className,
}) => {
    const { emails, problemId, problemType } = state;
    // const [emails, setEmails] = useState<string[]>(initialState?.emails ?? []);
    const [emailsInput, setEmailsInput] = useState<string>();
    // const [problemId, setProblemId] = useState<string | undefined>(
    //     initialState?.problemId
    // );
    // const [problemType, setProblemType] = useState<
    //     BriefProblemTypeDescription | undefined
    // >(initialState?.problemType);

    const updateProperty = useCallback(
        function <TProp extends keyof QueryState>(
            prop: TProp,
            value: QueryState[TProp] | ((prev: QueryState[TProp]) => void)
        ) {
            return setState((prev) => ({
                ...prev,
                [prop]: typeof value === "function" ? value(prev[prop]) : value,
            }));
        },
        [setState]
    );

    const addEmail =
        (forceAdd?: boolean) =>
        ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            const result = value.replace(/[\s,]+/i, "");
            const isDuplicate = emails?.includes(result);

            if (result && (forceAdd || result !== value)) {
                if (isDuplicate) {
                    return !toast("Cannot add duplicate email");
                }

                const [, regexError] = runCatching(() => new RegExp(result));
                if (regexError) {
                    return !toast(
                        `Pattern is not a valid: ${
                            (regexError as Error).message
                        }`
                    );
                }

                updateProperty("emails", (prev) => [...(prev || []), result]);
                setEmailsInput("");
                return true;
            }

            return false;
        };

    const removeEmail = (listId: number) =>
        updateProperty("emails", (prev) =>
            prev?.filter((_, index) => index !== listId)
        );

    const handleEmailsInputChange = (event: ChangeEvent<HTMLInputElement>) =>
        addEmail()(event) || setEmailsInput(event.target.value);

    return (
        <div
            className={classNames(
                "flex flex-col space-y-2 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-2",
                className
            )}
        >
            <div className="text-lg font-bold">Filters:</div>
            <Hideable isVisible={showUsers}>
                <div
                    className={classNames(
                        "flex flex-row items-start",
                        !emails?.length && "min-h-[4rem]"
                    )}
                >
                    Emails:
                    <div>
                        <Input
                            value={emailsInput}
                            onChange={handleEmailsInputChange}
                            onBlur={addEmail(true)}
                        />
                        <Hideable isVisible={emails?.length}>
                            <div className="h-2" />
                            <Tag.CheckableTag
                                checked
                                className="bg-red-300 text-black"
                                onClick={() =>
                                    updateProperty("emails", undefined)
                                }
                            >
                                Clear All
                            </Tag.CheckableTag>
                            {emails?.map((email, index) => (
                                <Tag.CheckableTag
                                    checked
                                    key={index}
                                    onClick={() => removeEmail(index)}
                                >
                                    {email}
                                </Tag.CheckableTag>
                            ))}
                        </Hideable>
                    </div>
                </div>
            </Hideable>
            {problems && (
                <div className="flex flex-row items-start">
                    Problem Id:
                    <Cascader
                        value={
                            [
                                problems.find((p) => p.id === problemId)?.id,
                            ].filter(Boolean) as string[]
                        }
                        showSearch={{ filter: cascaderSearchFilter }}
                        className="w-56" /* todo: options from users created problems */
                        options={problems.map((p) => ({
                            value: p.id,
                            label: `${p.title} / ${p.id}`,
                        }))}
                        onChange={([id]: any[] = []) =>
                            updateProperty("problemId", id)
                        }
                    />
                </div>
            )}
            {problemTypes && (
                <div className="flex flex-row items-start">
                    Problem Type:
                    <Cascader
                        value={[
                            problemTypes.find(
                                (pt) =>
                                    pt.programmingLanguage ===
                                        problemType?.programmingLanguage &&
                                    pt.solutionType ===
                                        problemType?.solutionType
                            ),
                        ]
                            .filter(Boolean)
                            .map(
                                (x) =>
                                    `${x?.programmingLanguage};${x?.solutionType}`
                            )}
                        showSearch={{ filter: cascaderSearchFilter }}
                        className="w-56" /* todo: options from users created problems */
                        options={problemTypes.map((x) => ({
                            value: `${x.programmingLanguage};${x.solutionType}`,
                            label: `${x.displayName} / ${x.description}`,
                        }))}
                        onChange={([id]: any[] = []) =>
                            updateProperty(
                                "problemType",
                                id
                                    ? [id.split(";")].map(([pl, st]) => ({
                                          programmingLanguage: pl,
                                          solutionType: st,
                                      }))[0]
                                    : undefined
                            )
                        }
                    />
                </div>
            )}
            <div className="flex flex-col space-y-2">
                <Button danger onClick={() => setState({})}>
                    Reset filters
                </Button>
            </div>
        </div>
    );
};
