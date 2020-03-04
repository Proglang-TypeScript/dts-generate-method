import { MethodDeclaration } from "./method";
import { ClassDeclaration } from "./class";
import { InterfaceDeclaration } from "./interface";

export interface NamespaceDeclaration {
	name: string,
	interfaces: InterfaceDeclaration[],
	functions: MethodDeclaration[],
	classes: ClassDeclaration[],
	exportAssignments: string[],
	errors: boolean,
	errorMessages: string[],
	namespaces: {
		[namespaceName: string]: NamespaceDeclaration;
	}
}