import * as React from "react";

import Seo from "@/components/Seo";

import { useAppSelector } from "@/redux";
import { getAuthUser } from "@/redux/selectors";

export default function HomePage() {
    const user = useAppSelector(getAuthUser);
    const title = "Grader Bot";
    const subTitle = "Automated grading system for programming solutions";
    return (
        <div className="flex h-4/5 w-full flex-col items-center justify-center space-y-2 text-center">
            <Seo templateTitle={`${title} - ${subTitle}`} />

            <h2 className="cursor-crosshair duration-300 ease-in-out hover:text-6xl">
                {title}
            </h2>
            <h3>{subTitle}</h3>
            <h4>{user && `Welcome ${user.email}!`}</h4>
        </div>
    );
}

export const getServerSideProps = () => {
    return { props: {} };
};
