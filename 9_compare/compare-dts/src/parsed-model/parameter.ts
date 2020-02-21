export interface ParameterDeclaration {
	name: string,
	type: { [key: string]: any },
	optional: boolean
}