import * as React from "react";

import Seo from "@/components/Seo";

export default function HomePage() {
    const title = "Grader Bot";
    const subTitle = "Automated grading system for programming solutions";
    return (
        <div className="flex h-4/5 w-full flex-col items-center justify-center text-center">
            <Seo templateTitle={`${title} - ${subTitle}`} />

            <h2 className="cursor-crosshair duration-300 ease-in-out hover:text-6xl">
                {title}
            </h2>
            <h3>{subTitle}</h3>
        </div>
    );
}

export const getServerSideProps = () => {
    return { props: {} };
};
