import { DeclaredPropertyType } from '../DeclaredProperty';

export class DeclaredPropertyTypeUnionType {
	kind: string;
	value: DeclaredPropertyType[];

	constructor(value: DeclaredPropertyType[]) {
		this.kind = "union_type";
		this.value = value;
	}
}