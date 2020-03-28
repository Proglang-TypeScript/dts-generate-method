import DeclaredPropertyType from "./DeclaredPropertyType";

export class DeclaredPropertyTypePrimitiveKeyword implements DeclaredPropertyType {
	kind: string;
	value: string;

	constructor(value: string) {
		this.kind = "primitive_keyword";
		this.value = value;
	}
}