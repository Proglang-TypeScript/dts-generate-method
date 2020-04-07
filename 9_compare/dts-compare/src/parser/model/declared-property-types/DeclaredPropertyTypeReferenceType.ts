import DeclaredPropertyType from "./DeclaredPropertyType";

export class DeclaredPropertyTypeReferenceType implements DeclaredPropertyType {
	kind: string;
	value: string;
	text: string;

	static KIND = "type_reference";

	constructor(value: string) {
		this.kind = DeclaredPropertyTypeReferenceType.KIND;
		this.value = value;
		this.text = "";
	}
}