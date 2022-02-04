import * as React from "react";

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
            <div className="max-w-1/2 flex h-full w-full flex-col items-center bg-gray-300">
                {children}
            </div>
        </div>
    );
}
