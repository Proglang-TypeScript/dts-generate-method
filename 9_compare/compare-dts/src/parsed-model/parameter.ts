export interface ParameterTypeDeclaration {
	kind: string;
	value: any;
}

export interface ParameterDeclaration {
	name: string,
	type: ParameterTypeDeclaration,
	optional: boolean
}