import { DeclaredInterface } from '../DeclaredInterface';
import DeclaredPropertyType from './DeclaredPropertyType';

export class DeclaredPropertyTypeLiteralType implements DeclaredPropertyType {
	kind: string;
	value: DeclaredInterface;

	constructor(value: DeclaredInterface) {
		this.kind = "type_literal";
		this.value = value;
	}
}