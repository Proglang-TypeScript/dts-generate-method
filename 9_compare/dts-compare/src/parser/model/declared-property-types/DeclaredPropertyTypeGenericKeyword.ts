import DeclaredPropertyType from "./DeclaredPropertyType";

export class DeclaredPropertyTypeGenericKeyword
  implements DeclaredPropertyType {
  kind: string;
  value: string;
  constraint?: DeclaredPropertyType;
  defaultValue?: DeclaredPropertyType;

  constructor(
    value: string,
    constraint?: DeclaredPropertyType,
    defaultValue?: DeclaredPropertyType
  ) {
    this.kind = "generic_keyword";
    this.value = value;
    this.constraint = constraint;
    this.defaultValue = defaultValue;
  }
}
