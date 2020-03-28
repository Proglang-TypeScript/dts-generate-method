import DeclaredPropertyType from './declared-property-types/DeclaredPropertyType';

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