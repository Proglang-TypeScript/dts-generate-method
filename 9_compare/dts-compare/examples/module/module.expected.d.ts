export function myFunction(a: string): number;
export function myOtherFunction(a: string[], b?: A.B): number;

type MyType = string[];

export namespace A {
	export interface B {
		a: MyType
	}
}