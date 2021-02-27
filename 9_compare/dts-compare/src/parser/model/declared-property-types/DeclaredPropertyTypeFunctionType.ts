import { DeclaredFunction } from '../DeclaredFunction';
import DeclaredPropertyType from './DeclaredPropertyType';

export class DeclaredPropertyTypeFunctionType implements DeclaredPropertyType {
  kind: string;
  value: DeclaredFunction;

  constructor(value: DeclaredFunction) {
    this.kind = 'function_type';
    this.value = value;
  }
}
