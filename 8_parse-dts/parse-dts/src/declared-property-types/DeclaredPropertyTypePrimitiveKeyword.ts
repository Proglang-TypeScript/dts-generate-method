export class DeclaredPropertyTypePrimitiveKeyword {
	kind: string;
	value: string;

	constructor(value: string) {
		this.kind = "primitive_keyword";
		this.value = value;
	}
}