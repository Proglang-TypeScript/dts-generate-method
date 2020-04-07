import { DeclaredFunction } from './DeclaredFunction';
import { DeclaredInterface } from './DeclaredInterface';
import { DeclaredClass } from './DeclaredClass';

export class DeclaredNamespace {
	name: string;
	interfaces: any[];
	functions: DeclaredFunction[];
	classes: DeclaredClass[];
	exportAssignments: string[];
	errors: boolean;
	errorMessages: string[];
	namespaces: {
		[namespaceName: string] : DeclaredNamespace;
	}

	constructor(name: string) {
		this.name = name;
		this.interfaces = [];
		this.functions = [];
		this.classes = [];
		this.exportAssignments = [];
		this.namespaces = {};
		this.errors = false;
		this.errorMessages = [];
	}

	addFunction(f: DeclaredFunction) {
		this.functions.push(f);
	}

	addNamespace(declaredNamespace: DeclaredNamespace) {
		this.namespaces[declaredNamespace.name] = declaredNamespace;
	}

	addInterface(i: DeclaredInterface) {
		this.interfaces.push(i);
	}

	addClass(c: DeclaredClass) {
		this.classes.push(c);
	}

	addExportAssignment(e: string) {
		this.exportAssignments.push(e);
	}
}