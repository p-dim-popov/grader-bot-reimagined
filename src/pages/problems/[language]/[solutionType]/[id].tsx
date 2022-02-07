import { Button, Select } from "antd";
import Axios from "axios";
import { debounce } from "lodash-es";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import AutoHide from "@/components/AutoHide";
import CodeEditor from "@/components/CodeEditor";
import Hideable from "@/components/Hideable";
import Seo from "@/components/Seo";

import { Problem } from "@/models/Problem";
import { useAppSelector } from "@/redux";
import { getIsLoggedIn } from "@/redux/selectors";
import { fetchProblemById } from "@/services/problems.service";
import { runCatchingAsync } from "@/utils";

interface IProblemIdPageProps {
    problem: Problem;
}

const ProblemIdPage: React.FC<IProblemIdPageProps> = ({ problem }) => {
    const isLoggedIn = useAppSelector(getIsLoggedIn);
    const router = useRouter();
    const [defaultValue, setDefaultValue] = useState("");
    const [saveState, setSaveState] = useState<"initial" | "saving" | "saved">(
        "initial"
    );
    const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">(
        "vs-dark"
    );

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

    return (
        <>
            <Seo />

            <div className="flex w-full flex-col space-y-4">
                <h2>{problem.title}</h2>
                <p>{problem.description}</p>
                <div
                    data-component="editor-setting-and-info"
                    className="flex h-6 flex-row justify-between"
                >
                    <div>
                        <span>Theme: </span>
                        <Select
                            defaultValue={editorTheme}
                            onChange={setEditorTheme}
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
                    path={`${router.query.id}.${router.query.language}`}
                    height="50vh"
                    width="100%"
                    defaultLanguage={router.query.language as string}
                    theme={editorTheme}
                    onChange={changeHandler}
                    defaultValue={defaultValue}
                />
                <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:space-y-0">
                    <Button type="primary">Try</Button>
                    <Hideable isVisible={isLoggedIn}>
                        <Button type="primary" danger>
                            Submit
                        </Button>
                    </Hideable>
                </div>
            </div>
        </>
    );
};

export default ProblemIdPage;

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
        return {
            redirect: {
                destination: "/404",
            },
            props: {
                problem: {} as any,
            },
        };
    }

    return {
        props: {
            problem: {} as any,
        },
    };
};
