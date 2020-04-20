export = MyFunction;

declare function MyFunction(name: string): MyFunction.NamedReturnType;
declare function MyFunction(length: boolean): MyFunction.LengthReturnType;

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