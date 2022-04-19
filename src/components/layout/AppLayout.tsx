import React from "react";
import { ToastContainer } from "react-toastify";

import { Footer } from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-full w-full flex-col overflow-x-hidden">
            <ToastContainer />
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
            <div className="max-w-1/2 mx-auto flex h-full w-full flex-col items-center bg-white py-8 px-2 md:px-14 lg:px-20">
                {children}
                <Footer />
            </div>
        </div>
    );
}
