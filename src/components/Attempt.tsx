import { DiffEditor } from "@monaco-editor/react";
import React from "react";

import ErrorIcon from "@/components/ErrorIcon";
import Hideable from "@/components/Hideable";
import SuccessIcon from "@/components/SuccessIcon";

import { SolutionAttempt } from "@/models/SolutionAttempt";
import { useAppSelector } from "@/redux";
import { getEditorTheme } from "@/redux/selectors";

const Attempt: React.FC<{ attempt: SolutionAttempt; title?: string }> = ({
    attempt,
    title,
}) => {
    const isSuccess = attempt.correctOutput === null;
    const editorTheme = useAppSelector(getEditorTheme);

    const heading = (
        <div className="flex flex-row items-center">
            <div className="m-2">
                <Hideable isVisible={isSuccess}>
                    <SuccessIcon className="w-10" />
                </Hideable>
                <Hideable isVisible={!isSuccess}>
                    <ErrorIcon className="w-10" />
                </Hideable>
            </div>
            <h4>Test Case: {title} / Left - Actual, Right - Expected</h4>
        </div>
    );

    const diff = (
        <DiffEditor
            original={attempt.output}
            modified={isSuccess ? attempt.output : attempt.correctOutput}
            height="20vh"
            theme={editorTheme}
        />
    );

    return (
        <>
            {heading}
            {diff}
        </>
    );
};

export default Attempt;
