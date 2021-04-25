type FirstCallback = (a1: SecondCallback) => number;
type SecondCallback = (a2: string) => number;

export function foo(cb: FirstCallback): number;
