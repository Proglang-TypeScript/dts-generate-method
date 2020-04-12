export = MyFunction;

declare function MyFunction(name: number): MyFunction.NamedReturnType;
declare function MyFunction(length: number): MyFunction.LengthReturnType;

declare namespace MyFunction {
	export interface LengthReturnType {
		width: number;
		height: number;
	}
	export interface NamedReturnType {
		firstName: string;
		lastName: string;
	}

	export const defaultName: string;
	export let defaultLength: number;
}