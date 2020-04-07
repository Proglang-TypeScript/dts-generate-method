import { DeclaredFunction } from './DeclaredFunction';
import { DeclaredProperty } from './DeclaredProperty';

export class DeclaredClass {
	name: string;
	properties: DeclaredProperty[];
	methods: DeclaredFunction[];
	constructors: DeclaredFunction[];

	constructor(name: string) {
		this.name = name;
		this.properties = [];
		this.methods = [];
		this.constructors = [];
	}

	addProperty(p: DeclaredProperty) {
		this.properties.push(p);
	}

	addMethod(m: DeclaredFunction) {
		this.methods.push(m);
	}

	addConstructor(c: DeclaredFunction) {
		this.constructors.push(c);
	}
}