import DeclaredPropertyType from "./DeclaredPropertyType";

export class DeclaredPropertyTypeIntersectionType implements DeclaredPropertyType {
	kind: string;
	value: DeclaredPropertyType[];

	constructor(value: DeclaredPropertyType[]) {
		this.kind = "intersection_type";
		this.value = value;
	}
}