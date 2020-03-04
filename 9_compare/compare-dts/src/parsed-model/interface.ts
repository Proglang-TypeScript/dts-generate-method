import { MethodDeclaration } from "./method";
import { ClassDeclaration } from "./class";
import { ParameterDeclaration } from "./parameter";

export interface InterfaceDeclaration {
	name: string;
	properties: ParameterDeclaration[];
	methods: MethodDeclaration[];
	classes: ClassDeclaration[];
	callSignatures: MethodDeclaration[];
}