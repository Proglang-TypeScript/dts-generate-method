import DeclaredPropertyType from "./DeclaredPropertyType";

export class DeclaredPropertyTypeGenericKeyword implements DeclaredPropertyType {
	kind: string;
	value: string;

	constructor(value: string) {
		this.kind = "generic_keyword";
		this.value = value;
	}
}