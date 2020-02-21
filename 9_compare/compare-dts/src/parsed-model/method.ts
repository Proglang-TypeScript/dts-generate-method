import { ParameterDeclaration } from "./parameter";

export interface MethodDeclaration {
	name: string,
	returnType: string,
	parameters:	ParameterDeclaration[]
}