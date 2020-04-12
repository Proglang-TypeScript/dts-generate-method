import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

export default class ParameterTypeEmptyIntersectionDifference implements Difference {
	private parameterExpected: DeclaredProperty;
	private parameterActual: DeclaredProperty;

	static CODE = "type-empty-intersection"

	code = ParameterTypeEmptyIntersectionDifference.CODE;

	constructor(parameterExpected: DeclaredProperty, parameterActual: DeclaredProperty) {
		this.parameterExpected = parameterExpected;
		this.parameterActual = parameterActual;
	}
}