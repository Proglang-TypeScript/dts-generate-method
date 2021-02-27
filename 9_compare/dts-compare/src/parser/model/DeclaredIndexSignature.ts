import { DeclaredProperty } from './DeclaredProperty';
import DeclaredPropertyType from './declared-property-types/DeclaredPropertyType';

export class DeclaredIndexSignature {
  parameter: DeclaredProperty;
  type: DeclaredPropertyType;

  constructor(parameter: DeclaredProperty, type: DeclaredPropertyType) {
    this.parameter = parameter;
    this.type = type;
  }
}
