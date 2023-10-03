import { DeclaredProperty } from './DeclaredProperty';
import { DeclaredPropertyTypeGenericKeyword } from './declared-property-types/DeclaredPropertyTypeGenericKeyword';
import DeclaredPropertyType from './declared-property-types/DeclaredPropertyType';

export class DeclaredFunction {
  name: string;
  parameters: DeclaredProperty[];
  returnType: DeclaredPropertyType;
  modifiers: string[];
  typeParameters: DeclaredPropertyTypeGenericKeyword[];
  private _isConstructor: boolean;

  constructor(name: string, returnType: DeclaredPropertyType) {
    this.name = name;
    this.returnType = returnType;
    this.parameters = [];
    this.modifiers = [];
    this.typeParameters = [];
    this._isConstructor = false;
  }

  addParameter(p: DeclaredProperty): DeclaredFunction {
    this.parameters.push(p);
    return this;
  }

  addTypeParameter(p: DeclaredPropertyTypeGenericKeyword): DeclaredFunction {
    this.typeParameters.push(p);
    return this;
  }

  addModifier(m: string): DeclaredFunction {
    this.modifiers.push(m);
    return this;
  }

  set isConstructor(isConstructor: boolean) {
    this._isConstructor = isConstructor;
  }

  get isConstructor(): boolean {
    return this._isConstructor;
  }
}
