import DeclaredPropertyType from './DeclaredPropertyType';

export class DeclaredPropertyTypeObjectKeyword implements DeclaredPropertyType {
  kind: string;
  value: string;

  constructor() {
    this.kind = 'object_keyword';
    this.value = 'object';
  }
}
