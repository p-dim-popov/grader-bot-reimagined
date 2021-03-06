import React from "react";

import Header from "@/components/layout/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    // Put Header or Footer Here
    return (
        <div className="h-full w-full">
            <style global jsx>{`
                html,
                body,
                body > div:first-child,
                div#__next,
                div#__next > div {
                    height: 100%;
                    width: 100%;
                }
            `}</style>
            <Header />
            <div className="max-w-1/2 flex h-full w-full flex-col items-center bg-white pt-8 md:items-start md:px-14 lg:px-20">
                {children}
            </div>
        </div>
    );
}
