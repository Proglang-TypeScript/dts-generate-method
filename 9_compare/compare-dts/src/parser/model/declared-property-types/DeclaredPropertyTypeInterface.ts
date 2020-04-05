import { DeclaredInterface } from '../DeclaredInterface';
import DeclaredPropertyType from './DeclaredPropertyType';

export class DeclaredPropertyTypeInterface implements DeclaredPropertyType {
	kind: string;
	value: DeclaredInterface;

	constructor(value: DeclaredInterface) {
		this.kind = "type_interface";
		this.value = value;
	}
}