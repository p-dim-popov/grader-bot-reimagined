import React from "react";

const SuccessIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={className}>
        <svg
            viewBox="0 0 87 87"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <g
                id="Page-1"
                stroke="none"
                strokeWidth={1}
                fill="none"
                fillRule="evenodd"
            >
                <g id="Group-3" transform="translate(2.000000, 2.000000)">
                    <circle
                        id="Oval-2"
                        stroke="rgba(165, 220, 134, 0.2)"
                        strokeWidth={4}
                        cx="41.5"
                        cy="41.5"
                        r="41.5"
                    />
                    <circle
                        className="ui-success-circle"
                        id="Oval-2"
                        stroke="#A5DC86"
                        strokeWidth={4}
                        cx="41.5"
                        cy="41.5"
                        r="41.5"
                    />
                    <polyline
                        className="ui-success-path"
                        id="Path-2"
                        stroke="#A5DC86"
                        strokeWidth={4}
                        points="19 38.8036813 31.1020744 54.8046875 63.299221 28"
                    />
                </g>
            </g>
        </svg>
    </div>
);

export default SuccessIcon;
