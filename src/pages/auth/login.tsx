import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import Seo from "@/components/Seo";

import { useAppSelector } from "@/redux";
import { getIsLoggedIn } from "@/redux/selectors";
import { wrapper } from "@/redux/store";
import { getAxios } from "@/utils";

const Login = () => {
    const [formData, setFormData] = useState<{
        email: string;
        password: string;
    } | null>(null);
    const router = useRouter();
    const backTo = router.query.backTo as string;
    const goBackOrHome = useCallback(
        () => router.push(backTo ?? "/"),
        [backTo, router]
    );
    const isLoggedIn = useAppSelector(getIsLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            goBackOrHome();
        }
    }, [isLoggedIn, goBackOrHome]);

    useEffect(() => {
        if (formData) {
            getAxios()
                .post<{ token: string }>("/auth/login", formData)
                .then(
                    (res) => {
                        window.document.cookie += `access_token=${res.data.token};Max-Age=10000;Path=/`;
                        goBackOrHome();
                    },
                    (e) => console.log(e)
                )
                .finally(() => setFormData(null));
        }
    }, [formData, goBackOrHome]);

    return (
        <>
            <Seo />
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={setFormData}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={!!formData}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default Login;

export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async ({ req, res }) => {
            const isLoggedIn = getIsLoggedIn(store.getState());
            return isLoggedIn
                ? { redirect: { destination: "/" }, props: {} }
                : { props: {} };
        }
);
