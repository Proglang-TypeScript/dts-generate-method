import { MethodDeclaration } from "./method";
import { ParameterDeclaration } from "./parameter";

export interface ClassDeclaration {
	name: string,
	properties: ParameterDeclaration[],
	methods: MethodDeclaration[],
	constructors: MethodDeclaration[]
}