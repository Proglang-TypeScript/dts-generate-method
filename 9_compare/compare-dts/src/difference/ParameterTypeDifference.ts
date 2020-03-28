import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

export default class ParameterTypeDifference implements Difference {
	private parameterExpected: DeclaredProperty;
	private parameterActual: DeclaredProperty;

	constructor(parameterExpected: DeclaredProperty, parameterActual: DeclaredProperty) {
		this.parameterExpected = parameterExpected;
		this.parameterActual = parameterActual;
	}
}