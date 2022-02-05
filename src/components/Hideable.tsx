import React from "react";

const Hideable: React.FC<{ isVisible: unknown }> = ({
    isVisible,
    children,
}) => <>{Boolean(isVisible) && children}</>;

export default Hideable;
