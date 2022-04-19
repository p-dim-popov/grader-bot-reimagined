import React from "react";

export const Footer: React.FC = () => {
    return (
        <footer className="mt-auto flex flex-col bg-white">
            <div className="h-12" />
            <div className="-m-8 flex h-12 w-screen flex-row items-center justify-between border-t border-gray-300 px-4 shadow-lg">
                <div>Trademark GraderBot {new Date().getUTCFullYear()}</div>
                <div>Peter Popov</div>
            </div>
        </footer>
    );
};
