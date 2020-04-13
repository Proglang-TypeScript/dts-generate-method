import { DeclaredProperty } from './DeclaredProperty';

export class DeclaredFunction {
	name: string;
	parameters: DeclaredProperty[];
	returnType: string;
	modifiers: string[];

	constructor(name: string, returnType: string) {
		this.name = name;
		this.returnType = returnType;
		this.parameters = [];
		this.modifiers = [];
	}

	addParameter(p: DeclaredProperty): DeclaredFunction {
		this.parameters.push(p);
		return this;
	}

	addModifier(m: string) : DeclaredFunction {
		this.modifiers.push(m);
		return this;
	}
}