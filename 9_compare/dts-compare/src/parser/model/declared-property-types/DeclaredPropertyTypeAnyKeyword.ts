import DeclaredPropertyType from "./DeclaredPropertyType";

export class DeclaredPropertyTypeAnyKeyword implements DeclaredPropertyType {
  kind: string;
  value: string;

  constructor() {
    this.kind = "any_keyword";
    this.value = "any";
  }
}
