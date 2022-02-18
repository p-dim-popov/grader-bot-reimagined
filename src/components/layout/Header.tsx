import { useRouter } from "next/router";
import * as React from "react";

import Hideable from "@/components/Hideable";
import UnstyledLink from "@/components/links/UnstyledLink";

import { useAppSelector } from "@/redux";
import { getIsLoggedIn } from "@/redux/selectors";

const ListItemLink: React.FC<{
    label: string;
    href: string;
    description?: string;
}> = ({ label, href, description }) => (
    <li>
        <UnstyledLink
            href={href}
            className="underline-offset-8 hover:text-gray-600 hover:underline"
            title={description}
        >
            {label}
        </UnstyledLink>
    </li>
);

const Divider: React.FC = () => <span>|</span>;

export default function Header() {
    const isLoggedIn = useAppSelector(getIsLoggedIn);
    const mostRecentProblem = useAppSelector((x) => x.problems.mostRecent);
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-lg">
            <div className="layout flex h-14 items-center justify-between">
                <UnstyledLink
                    href="/"
                    className="font-bold hover:text-gray-600"
                >
                    Home
                </UnstyledLink>
                <nav>
                    <ul className="flex items-center justify-between space-x-2">
                        <div className="invisible flex flex-row space-x-2 md:visible">
                            <div className="font-bold">
                                Most recently solved problem:
                            </div>
                            <ListItemLink
                                label={mostRecentProblem.displayName}
                                href={`/${mostRecentProblem.language}/${mostRecentProblem.solutionType}/problems`}
                                description={mostRecentProblem.description}
                            />
                            <Divider />
                        </div>
                        <ListItemLink
                            label="Problems"
                            href="/problems/types"
                            description="All available problem types"
                        />
                        <Divider />
                        <Hideable isVisible={!isLoggedIn}>
                            <ListItemLink
                                label="Register"
                                href="/auth/register"
                            />
                            <Divider />
                            <ListItemLink
                                label="Login"
                                href={`/auth/login?backTo=${encodeURIComponent(
                                    router.asPath
                                )}`}
                            />
                            <Divider />
                        </Hideable>
                        <Hideable isVisible={isLoggedIn}>
                            <ListItemLink
                                label="Solutions"
                                href="/solutions"
                                description="All submitted solutions"
                            />
                            <Divider />
                            <ListItemLink label="Logout" href="/auth/logout" />
                            <Divider />
                        </Hideable>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
