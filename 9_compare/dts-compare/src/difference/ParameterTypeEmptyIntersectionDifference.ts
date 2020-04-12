import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

export default class ParameterTypeEmptyIntersectionDifference implements Difference {
	private parameterExpected: DeclaredProperty;
	private parameterActual: DeclaredProperty;

	code = "type-empty-intersection";

	constructor(parameterExpected: DeclaredProperty, parameterActual: DeclaredProperty) {
		this.parameterExpected = parameterExpected;
		this.parameterActual = parameterActual;
	}
}