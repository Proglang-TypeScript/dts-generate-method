import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

export default class ParameterTypeSolvableDifference implements Difference {
  private parameterExpected: DeclaredProperty;
  private parameterActual: DeclaredProperty;

  static CODE = "type-non-empty-intersection";

  code = ParameterTypeSolvableDifference.CODE;

  constructor(
    parameterExpected: DeclaredProperty,
    parameterActual: DeclaredProperty
  ) {
    this.parameterExpected = parameterExpected;
    this.parameterActual = parameterActual;
  }
}
