import { FileOutlined } from "@ant-design/icons";
import { Button, Cascader, Form, Input, Modal, Upload } from "antd";
import Axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

import { Problem } from "@/models/Problem";
import { BriefProblemTypeDescription } from "@/models/ProblemTypeDescription";
import { useAppSelector } from "@/redux";
import { getProblemTypes } from "@/redux/selectors";
import { editOrCreateProblem } from "@/services/problems.service";
import { runCatchingAsync } from "@/utils";

type Props = {
    problem?: Problem;
};

export const ProblemForm: React.FC<Props> = (props) => {
    const router = useRouter();
    const isEditing = props.problem && true;
    const problemTypes = useAppSelector(getProblemTypes);
    const [solutionSource, setSolutionSource] = useState<File[] | null>(null);
    const [problemInput, setProblemInput] = useState<File[] | null>(null);

    const validateUploadable = (
        files: File[] | null,
        fieldName: string
    ): string | undefined => {
        const validate = () => {
            if (!isEditing && !files?.length) {
                return `Is required`;
            }

            if (isEditing && files && !files.length) {
                return `Must upload new file in place of the old one`;
            }

            if (files && files.length > 1) {
                return `Select only one file`;
            }
        };

        const result = validate();
        if (result) {
            return `Error: ${fieldName}: ${result}`;
        }
    };

    const onFinish = async (values: Problem) => {
        const formData = new FormData();

        const shouldStop = (
            [
                ["Source", solutionSource, "Solution Source"],
                ["Input", problemInput, "Problem Input"],
            ] as [string, File[] | null, string][]
        ).map(([formDataFieldName, files, displayName]) => {
            const error = validateUploadable(files, displayName);
            if (error) {
                return toast(error);
            }

            if (files && files[0]) {
                formData.set(
                    formDataFieldName,
                    (files[0] as any).originFileObj
                );
            }
        });

        if (shouldStop.some(Boolean)) {
            return;
        }

        if (props.problem) {
            formData.set("Id", props.problem.id);
        }

        formData.set("Title", values.title);
        formData.set("Description", values.description);

        const [programmingLanguage, solutionType] = (
            values.type as unknown as string[]
        )
            .pop()!
            .split(";");
        const type: BriefProblemTypeDescription = {
            programmingLanguage,
            solutionType,
        };

        const [problem, error] = await runCatchingAsync(
            editOrCreateProblem(type, formData)
        );
        if (error) {
            console.error(error);

            if (Axios.isAxiosError(error)) {
                const message = error.response?.data.message;
                if (message) {
                    return toast(message);
                }

                return toast(error.message);
            }
            return toast("Something happened...");
        }

        router.push(`/problems/${problem.id}`);
    };

    return (
        <>
            <Form
                className="w-full"
                name="main"
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <Form.Item>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true }]}
                        initialValue={props.problem?.title}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true }]}
                        initialValue={props.problem?.description}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Solution"
                        name="solution"
                        valuePropName="fileList"
                        getValueFromEvent={({ fileList }) =>
                            setSolutionSource(fileList)
                        }
                    >
                        <Upload.Dragger
                            name="solution"
                            beforeUpload={() => false}
                            showUploadList={{
                                showDownloadIcon: true,
                            }}
                            defaultFileList={
                                isEditing
                                    ? [
                                          {
                                              uid: props.problem!.id,
                                              name: "Current Solution",
                                              status: "done",
                                              url: `/api/solutions/${
                                                  props.problem!.id
                                              }/download`,
                                          },
                                      ]
                                    : undefined
                            }
                        >
                            <p className="ant-upload-drag-icon">
                                <FileOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                                solution source file/s
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item
                        label="Input"
                        name="input"
                        valuePropName="fileList"
                        getValueFromEvent={({ fileList }) => (
                            console.log(fileList), setProblemInput(fileList)
                        )}
                    >
                        <Upload.Dragger
                            name="input"
                            beforeUpload={() => false}
                            showUploadList={{
                                showDownloadIcon: true,
                            }}
                            defaultFileList={
                                isEditing
                                    ? [
                                          {
                                              uid: props.problem!.id,
                                              name: "Current input",
                                              status: "done",
                                              url: `/api/problems/${
                                                  props.problem!.id
                                              }/input`,
                                          },
                                      ]
                                    : undefined
                            }
                        >
                            <p className="ant-upload-drag-icon">
                                <FileOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                                problem input or test data
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Solution type"
                        rules={[{ required: true }]}
                        initialValue={
                            props.problem
                                ? [
                                      `${props.problem.type.programmingLanguage};${props.problem.type.solutionType}`,
                                  ]
                                : undefined
                        }
                    >
                        <Cascader
                            options={(problemTypes || []).map((type) => ({
                                value: `${type.programmingLanguage};${type.solutionType}`,
                                label: `${type.displayName} / ${type.description}`,
                            }))}
                            placeholder="Please select solution type"
                            showSearch={{
                                filter: function (inputValue, path) {
                                    return path.some(
                                        (option) =>
                                            typeof option.label === "string" &&
                                            option.label
                                                .toLowerCase()
                                                .indexOf(
                                                    inputValue.toLowerCase()
                                                ) > -1
                                    );
                                },
                            }}
                        />
                    </Form.Item>
                    <div className="flex flex-row items-baseline justify-between">
                        <Form.Item
                            wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                        >
                            <Button type="primary" htmlType="submit">
                                {isEditing ? "Save" : "Create"}
                            </Button>
                        </Form.Item>
                        <Button
                            onClick={() =>
                                Modal.confirm({
                                    type: "warn",
                                    onOk: () =>
                                        props.problem
                                            ? router.push(
                                                  `/problems/${props.problem.id}`
                                              )
                                            : router.push("/problems/types"),
                                    title: "Are you sure?",
                                    content:
                                        "You are about to discard all changes (if any)!",
                                })
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            danger
                            onClick={() =>
                                Modal.confirm({
                                    type: "error",
                                    onOk: () => console.log("todo: delete"),
                                    title: "Are you sure you want to delete that problem?",
                                    content: "This action cannot be undone!",
                                })
                            }
                        >
                            Delete
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: "${label} is required!",
    types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};
