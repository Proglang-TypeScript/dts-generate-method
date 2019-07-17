import { DeclaredPropertyType } from "../DeclaredProperty";

export class DeclaredPropertyArrayType {
	kind: string;
	value: DeclaredPropertyType;

	constructor(value: DeclaredPropertyType) {
		this.kind = "array_type";
		this.value = value;
	}
}