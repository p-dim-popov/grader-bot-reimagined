import React from "react";

import Seo from "@/components/Seo";

import { wrapper } from "@/redux/store";

const ProblemsListingPage: React.FC = () => {
    return (
        <>
            <Seo />
            Soon...
        </>
    );
};

export default ProblemsListingPage;

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (context) => {
        return {
            props: {},
        };
    }
);
