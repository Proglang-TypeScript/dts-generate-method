import DeclaredPropertyType from './DeclaredPropertyType';

export class DeclaredPropertyTypeUndefinedKeyword implements DeclaredPropertyType {
  kind: string;
  value: string;

  constructor() {
    this.kind = 'undefined_keyword';
    this.value = 'undefined';
  }
}
