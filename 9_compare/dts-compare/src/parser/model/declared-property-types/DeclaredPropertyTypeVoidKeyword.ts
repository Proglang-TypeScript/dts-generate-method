import DeclaredPropertyType from './DeclaredPropertyType';

export class DeclaredPropertyTypeVoidKeyword implements DeclaredPropertyType {
  kind: string;
  value: string;

  constructor() {
    this.kind = 'void_keyword';
    this.value = 'void';
  }
}
