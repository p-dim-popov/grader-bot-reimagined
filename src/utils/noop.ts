declare global {
    const noop: () => void;

    interface Window {
        noop: typeof noop;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

if (typeof window === "undefined") {
    (global as any).noop = noop;
} else {
    window.noop = noop;
}
