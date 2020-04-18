import { DeclaredProperty } from './DeclaredProperty';

export class DeclaredFunction {
	name: string;
	parameters: DeclaredProperty[];
	returnType: string;
	modifiers: string[];
	private _isConstructor: boolean;

	constructor(name: string, returnType: string) {
		this.name = name;
		this.returnType = returnType;
		this.parameters = [];
		this.modifiers = [];
		this._isConstructor = false;
	}

	addParameter(p: DeclaredProperty): DeclaredFunction {
		this.parameters.push(p);
		return this;
	}

	addModifier(m: string) : DeclaredFunction {
		this.modifiers.push(m);
		return this;
	}

	set isConstructor(isConstructor: boolean) {
		this._isConstructor = isConstructor;
	}

	get isConstructor() : boolean {
		return this._isConstructor;
	}
}