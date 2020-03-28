import Difference from "./Difference";
import { ParameterDeclaration } from "../parsed-model/parameter";

export default class ParameterTypeDifference implements Difference {
	private parameterExpected: ParameterDeclaration;
	private parameterActual: ParameterDeclaration;

	constructor(parameterExpected: ParameterDeclaration, parameterActual: ParameterDeclaration) {
		this.parameterExpected = parameterExpected;
		this.parameterActual = parameterActual;
	}
}