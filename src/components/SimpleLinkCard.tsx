import Link from "next/link";
import React from "react";

interface ISimpleLinkCardProps {
    href: string;
    title: string;
    description: string;
    footer: string;
}

const SimpleLinkCard: React.FC<ISimpleLinkCardProps> = ({
    href,
    title,
    description,
    footer,
}) => (
    <li className="list-none">
        <Link href={href} passHref>
            <a>
                <div className="w-full max-w-sm lg:flex lg:max-w-full">
                    <div className="flex flex-col justify-between rounded-b border-r border-b border-l border-gray-400 bg-white p-4 leading-normal lg:rounded-b-none lg:rounded-r lg:border-l-0 lg:border-t lg:border-gray-400">
                        <div className="mb-8">
                            <section className="mb-2 text-xl font-bold text-gray-900">
                                {title}
                            </section>
                            <div className="text-base text-gray-700">
                                {description}
                            </div>
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
