import DeclaredPropertyType from "./DeclaredPropertyType";

export class DeclaredPropertyTypeLiterals implements DeclaredPropertyType {
	kind: string;
	value: string;

	constructor(value: string) {
		this.kind = "literal_type";
		this.value = value;
	}
}