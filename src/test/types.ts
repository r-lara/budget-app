/**
 * Resolved value of an async function. Useful for typing partial fixtures
 * passed to `mockResolvedValue` without falling back to `any`.
 */
export type Resolved<T extends (...args: never[]) => Promise<unknown>> = Awaited<ReturnType<T>>;
