import { DeclaredInterface } from '../DeclaredInterface';

export class DeclaredPropertyTypeLiteralType {
	kind: string;
	value: DeclaredInterface;

	constructor(value: DeclaredInterface) {
		this.kind = "type_literal";
		this.value = value;
	}
}