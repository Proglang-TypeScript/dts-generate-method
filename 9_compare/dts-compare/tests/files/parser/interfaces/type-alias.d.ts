export = A

declare type MyType =
	string
	| number;

declare type CircularMyType = string | AnotherType;

declare type AnotherType = (props: string) => CircularMyType;

declare function A(a: MyType, b: CircularMyType): string;