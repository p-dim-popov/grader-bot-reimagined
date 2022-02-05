import React from "react";

import { SetAuthUserAction } from "@/redux/actions";
import { wrapper } from "@/redux/store";
import { clearAuthCookie } from "@/utils";

const Logout: React.FC = () => <></>;

export default Logout;

export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async ({ req, res }) => {
            clearAuthCookie(res);
            store.dispatch(SetAuthUserAction.create());

            return {
                redirect: {
                    destination: "/",
                },
                props: {},
            };
        }
);
