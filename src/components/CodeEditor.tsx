import Editor, { EditorProps } from "@monaco-editor/react";
import packageJson from "@monaco-editor/react/package.json";
import Head from "next/head";
import React from "react";

const CodeEditor: React.FC<EditorProps> = (props) => {
    return (
        <>
            <Head>
                {/* Workaround for https://github.com/suren-atoyan/monaco-react/issues/272 */}
                <link
                    rel="stylesheet"
                    type="text/css"
                    data-name="vs/editor/editor.main"
                    href={`https://cdn.jsdelivr.net/npm/monaco-editor@${packageJson.peerDependencies["monaco-editor"]}/min/vs/editor/editor.main.css`}
                />
            </Head>
            <Editor {...props} />
        </>
    );
};

export default CodeEditor;
