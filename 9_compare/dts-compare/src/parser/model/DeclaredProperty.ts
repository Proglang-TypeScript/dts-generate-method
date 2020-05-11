import DeclaredPropertyType from './declared-property-types/DeclaredPropertyType';
import DATA_MODIFIERS from './data-modifiers';


export class DeclaredProperty {
	name: string;
	type: DeclaredPropertyType;
	optional: boolean;
	modifiers: DATA_MODIFIERS[];

	constructor(name: string, type: DeclaredPropertyType, optional: boolean) {
		this.name = name;
		this.type = type;
		this.optional = optional;
		this.modifiers = [];
	}

	addModifier(modifier: DATA_MODIFIERS) {
		this.modifiers.push(modifier);
		return this;
	}
}