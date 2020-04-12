import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

export default class ParameterTypeNonEmptyIntersectionDifference implements Difference {
	private parameterExpected: DeclaredProperty;
	private parameterActual: DeclaredProperty;

	static CODE = "type-non-empty-intersection"

	code = ParameterTypeNonEmptyIntersectionDifference.CODE;

	constructor(parameterExpected: DeclaredProperty, parameterActual: DeclaredProperty) {
		this.parameterExpected = parameterExpected;
		this.parameterActual = parameterActual;
	}
}