import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

export default class ParameterExtraDifference implements Difference {
  private parameterExtra: DeclaredProperty;

  static CODE = "extra-parameter";

  code = ParameterExtraDifference.CODE;

  constructor(parameterExtra: DeclaredProperty) {
    this.parameterExtra = parameterExtra;
  }
}
