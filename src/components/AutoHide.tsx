import React, { useEffect, useState } from "react";

const AutoHide: React.FC<{ timeout: number }> = ({ timeout, children }) => {
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const timeoutRef = setTimeout(() => {
            setIsHidden(true);
        }, timeout);

        return () => clearTimeout(timeoutRef);
    }, [timeout]);

    return isHidden ? null : <>{children}</>;
};

export default AutoHide;
