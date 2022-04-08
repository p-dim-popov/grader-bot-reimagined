import classNames from "classnames";
import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import stripMarkdown from "strip-markdown";

import Hideable from "@/components/Hideable";

interface ISimpleLinkCardProps {
    href: string;
    title: string;
    description?: string;
    footer: string;
    className?: string;
}

const SimpleLinkCard: React.FC<ISimpleLinkCardProps> = ({
    href,
    title,
    description,
    footer,
    className,
}) => (
    <li className={classNames("m-3 max-w-lg list-none", className)}>
        <Link href={href} passHref>
            <a>
                <div className="w-full max-w-sm lg:flex lg:max-w-full">
                    <div className="flex flex-col justify-between rounded border border-gray-400 bg-white p-4 leading-normal">
                        <div className="mb-8">
                            <section className="mb-2 text-xl font-bold text-gray-900">
                                {title}
                            </section>
                            <Hideable isVisible={description}>
                                <div className="max-h-24 overflow-y-hidden text-base text-gray-700 lg:max-h-20">
                                    <ReactMarkdown
                                        remarkPlugins={[stripMarkdown]}
                                    >
                                        {description ?? ""}
                                    </ReactMarkdown>
                                </div>
                            </Hideable>
                        </div>
                        <div className="flex items-center">
                            <div className="text-sm">
                                <section className="leading-none text-gray-900">
                                    {footer}
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    </li>
);

export default SimpleLinkCard;
