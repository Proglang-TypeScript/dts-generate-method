import DeclaredPropertyType from "./DeclaredPropertyType";

export class DeclaredPropertyTypeUnionType implements DeclaredPropertyType {
	kind: string;
	value: DeclaredPropertyType[];

	constructor(value: DeclaredPropertyType[]) {
		this.kind = "union_type";
		this.value = value;
	}
}