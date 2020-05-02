import DeclaredPropertyType from "./DeclaredPropertyType";

export class DeclaredPropertyTypeTupleType implements DeclaredPropertyType {
	kind: string;
	value: DeclaredPropertyType[];

	constructor(value: DeclaredPropertyType[]) {
		this.kind = "tuple_type";
		this.value = value;
	}
}