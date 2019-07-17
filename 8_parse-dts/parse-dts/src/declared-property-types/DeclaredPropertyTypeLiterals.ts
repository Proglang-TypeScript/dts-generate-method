export class DeclaredPropertyTypeLiterals {
	kind: string;
	value: string;

	constructor(value: string) {
		this.kind = "literal_type";
		this.value = value;
	}
}