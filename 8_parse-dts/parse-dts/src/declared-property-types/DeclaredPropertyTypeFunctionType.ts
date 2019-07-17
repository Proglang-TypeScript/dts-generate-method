import { DeclaredFunction } from '../DeclaredFunction';

export class DeclaredPropertyTypeFunctionType {
	kind: string;
	value: DeclaredFunction;

	constructor(value: DeclaredFunction) {
		this.kind = "function_type";
		this.value = value;
	}
}