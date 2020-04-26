export = MyFunctionWithOtherName;

declare function MyFunctionWithOtherName(name: string): MyFunctionWithOtherName.NamedReturnTypeWithOtherName;
declare function MyFunctionWithOtherName(length: boolean): MyFunctionWithOtherName.LengthReturnTypeWithOtherName;

declare namespace MyFunctionWithOtherName {
	export interface LengthReturnTypeWithOtherName {
		width: number;
		height: number;
	}
	export interface NamedReturnTypeWithOtherName {
		firstName: string;
		lastName: string;
	}

	export const defaultName: string;
	export let defaultLength: number;
}