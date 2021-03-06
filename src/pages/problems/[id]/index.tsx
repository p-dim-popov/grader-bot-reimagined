import { Button, Select } from "antd";
import Axios from "axios";
import { debounce } from "lodash-es";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Attempt from "@/components/Attempt";
import AutoHide from "@/components/AutoHide";
import CodeEditor from "@/components/CodeEditor";
import Hideable from "@/components/Hideable";
import Seo from "@/components/Seo";

import { Problem } from "@/models/Problem";
import { SolutionAttempt } from "@/models/SolutionAttempt";
import { useAppSelector } from "@/redux";
import { SetEditorThemeAction } from "@/redux/actions";
import {
    getAuthUser,
    getEditorTheme,
    getIsLoggedIn,
    isAuthUserInOneOfRoles,
} from "@/redux/selectors";
import { fetchProblemById } from "@/services/problems.service";
import { submitSolution } from "@/services/solutions.service";
import {
    createAxiosErrorRedirectObject,
    runCatchingAsync,
    useOverrideCtrlS,
} from "@/utils";
import withErrorHandler from "@/utils/withErrorHandler";

interface IProblemIdPageProps {
    problem: Problem;
}

const ProblemIdPage: React.FC<IProblemIdPageProps> = ({ problem }) => {
    const isLoggedIn = useAppSelector(getIsLoggedIn);
    const isAdmin = useAppSelector(isAuthUserInOneOfRoles("Admin"));
    const user = useAppSelector(getAuthUser);

    const canEdit =
        isLoggedIn && (isAdmin || user?.email === problem.authorEmail);

    const router = useRouter();
    const [defaultValue, setDefaultValue] = useState("");
    const [saveState, setSaveState] = useState<"initial" | "saving" | "saved">(
        "initial"
    );
    const editorTheme = useAppSelector(getEditorTheme);
    const dispatch = useDispatch();

    const localStorageKey = `problem:${router.query.id}`;

    useEffect(() => {
        const savedValue = localStorage.getItem(localStorageKey);
        if (savedValue) {
            setDefaultValue(savedValue);
        }
    }, [localStorageKey]);

    const debouncedSave = useCallback(
        debounce((value: string | undefined) => {
            if (value) {
                localStorage.setItem(localStorageKey, value);
            } else {
                localStorage.removeItem(localStorageKey);
            }

            setSaveState("saved");
        }, 500),
        [localStorageKey]
    );

    const changeHandler = useCallback(
        (value: string | undefined) => {
            setSaveState("saving");
            debouncedSave(value);
        },
        [debouncedSave]
    );

    useOverrideCtrlS();

    const [fragmentedAttempts, setFragmentedAttempts] = useState<
        {
            id?: string;
            submissionDate: string;
            attempts: SolutionAttempt[];
        }[]
    >([]);

    const handleSubmit = (type: "try" | "submit") => async () => {
        const submissionDate = new Date().toLocaleString();
        const [result, error] = await runCatchingAsync(
            submitSolution(
                problem.id,
                window.localStorage.getItem(localStorageKey) ?? "",
                type === "submit"
            )
        );

        if (result) {
            setFragmentedAttempts((prev) => [
                {
                    id: result.id,
                    attempts: result.attempts,
                    submissionDate,
                },
                ...prev,
            ]);
        }

        if (Axios.isAxiosError(error)) {
            toast(
                `Something happened. Error: ${
                    error.message.length > 100
                        ? `${error.message.substring(0, 100)}...`
                        : error.message
                }`
            );
        }
    };

    return (
        <>
            <Seo
                templateTitle={`${problem.title} | ${problem.type.displayName} | ${problem.type.description}`}
                description={problem.description}
            />

            <div className="flex w-full flex-col space-y-4">
                <div className="flex flex-row space-x-2">
                    <h2>{problem.title}</h2>
                    <Hideable isVisible={canEdit}>
                        <Link href={`/problems/${problem.id}/edit`} passHref>
                            <Button type="primary">Edit</Button>
                        </Link>
                    </Hideable>
                </div>
                <div className="flex flex-row flex-wrap items-baseline space-x-2">
                    <div>Category:</div>
                    <Link
                        href={`/${problem.type.programmingLanguage}/${problem.type.solutionType}/problems`}
                        passHref
                    >
                        <Button type="dashed">
                            <h4>{problem.type.displayName}</h4>
                        </Button>
                    </Link>
                </div>
                <section>
                    <div className="pb-3 text-2xl font-bold">
                        Problem Description:
                    </div>
                    <div className="rounded-md border p-3">
                        <ReactMarkdown>{problem.description}</ReactMarkdown>
                    </div>
                </section>
                <div
                    data-component="editor-setting-and-info"
                    className="flex h-6 flex-row justify-between"
                >
                    <div>
                        <span>Theme: </span>
                        <Select
                            defaultValue={editorTheme}
                            onChange={(value) =>
                                dispatch(SetEditorThemeAction.create(value))
                            }
                        >
                            <Select.Option value="vs-dark">Dark</Select.Option>
                            <Select.Option value="light">Light</Select.Option>
                        </Select>
                    </div>
                    {
                        {
                            initial: null,
                            saving: <>Saving...</>,
                            saved: <AutoHide timeout={1_000}>Saved</AutoHide>,
                        }[saveState]
                    }
                </div>
                <CodeEditor
                    path={`${router.query.id}.${problem.type.programmingLanguage}`}
                    height="50vh"
                    width="100%"
                    defaultLanguage={problem.type.programmingLanguage}
                    theme={editorTheme}
                    onChange={changeHandler}
                    defaultValue={defaultValue}
                />
                <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:space-y-0">
                    <Button type="primary" onClick={handleSubmit("try")}>
                        Try
                    </Button>
                    <Hideable isVisible={isLoggedIn}>
                        <Button
                            type="primary"
                            danger
                            onClick={handleSubmit("submit")}
                        >
                            Submit
                        </Button>
                    </Hideable>
                </div>
                <Hideable isVisible={fragmentedAttempts.length}>
                    <div>
                        <h3 className="pb-4 underline">Attempts</h3>
                        <div className="flex flex-col">
                            {fragmentedAttempts
                                .map(({ attempts, submissionDate, id }) => {
                                    const percentageSuccess = Math.round(
                                        (attempts.filter(
                                            (x) => !x.correctOutput
                                        ).length /
                                            attempts.length) *
                                            100
                                    );

                                    return (
                                        <div
                                            className="pt-4"
                                            key={submissionDate}
                                        >
                                            <h3>
                                                {submissionDate} (
                                                {attempts.length} cases,{" "}
                                                {percentageSuccess}% Success)
                                                <Hideable isVisible={id}>
                                                    {" / "}
                                                    <Link
                                                        href={`/solutions/${id}`}
                                                    >
                                                        {id}
                                                    </Link>
                                                </Hideable>
                                            </h3>
                                            {attempts.map((attempt, i) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-col pt-8"
                                                >
                                                    <Attempt
                                                        attempt={attempt}
                                                        title={`#${i}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })
                                .reduce(
                                    (prev, cur, i) => (
                                        <>
                                            {prev}
                                            <Hideable isVisible={i !== 0}>
                                                <div className="my-10 flex-grow border-t border-gray-400" />
                                            </Hideable>
                                            {cur}
                                        </>
                                    ),
                                    <></>
                                )}
                        </div>
                    </div>
                </Hideable>
            </div>
        </>
    );
};

export default withErrorHandler(ProblemIdPage);

export const getServerSideProps: GetServerSideProps<
    IProblemIdPageProps
> = async (context) => {
    const id = context.query.id as string;
    const [problem, error] = await runCatchingAsync(fetchProblemById(id));

    if (problem) {
        return {
            props: {
                problem,
            },
        };
    }

    if (Axios.isAxiosError(error)) {
        return createAxiosErrorRedirectObject(error);
    }

    return {
        props: {
            problem: {} as any,
        },
    };
};
