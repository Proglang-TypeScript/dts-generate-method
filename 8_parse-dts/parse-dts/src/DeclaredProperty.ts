export interface DeclaredPropertyType {
	kind: string;
	value: any;
}

export class DeclaredProperty {
	name: string;
	type: DeclaredPropertyType;
	optional: boolean;

	constructor(name: string, type: DeclaredPropertyType, optional: boolean) {
		this.name = name;
		this.type = type;
		this.optional = optional;
	}
}