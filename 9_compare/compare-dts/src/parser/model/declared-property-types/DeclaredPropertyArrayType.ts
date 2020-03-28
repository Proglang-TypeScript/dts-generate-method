import DeclaredPropertyType from './DeclaredPropertyType';

export class DeclaredPropertyArrayType implements DeclaredPropertyType {
	kind: string;
	value: DeclaredPropertyType;

	constructor(value: DeclaredPropertyType) {
		this.kind = "array_type";
		this.value = value;
	}
}