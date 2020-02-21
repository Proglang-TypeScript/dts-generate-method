import { Difference } from "../difference/Difference";
import { Comparison } from "./comparison";
import { MethodDeclaration } from "../parsed-model/method";
import { ParameterTypeDifference } from "../difference/ParameterTypeDifference";
import { ParameterDeclaration } from "../parsed-model/parameter";

export class MethodParametersComparison implements Comparison {
	private methodExpected: MethodDeclaration;
	private methodActual: MethodDeclaration;

	constructor(methodExpected: MethodDeclaration, methodActual: MethodDeclaration) {
		this.methodExpected = methodExpected;
		this.methodActual = methodActual;
	}

	compare() : Difference[] {
		let parametersActual = this.methodActual.parameters;
		let parametersExpected = this.methodExpected.parameters;

		let differences: Difference[] = [];

		for (let i = 0; i < Math.min(parametersExpected.length, parametersActual.length); i++) {
			const parameterExpected = parametersExpected[i];
			const parameterActual = parametersActual[i];

			if (this.areDifferent(parameterExpected, parameterActual)) {
				differences = differences.concat(new ParameterTypeDifference(
					parameterExpected,
					parameterActual
				));
			}
		}

		return differences;
	}

	private areDifferent(parameterExpected: ParameterDeclaration, parameterActual: ParameterDeclaration) {
		return this.serialize(parameterExpected) !== this.serialize(parameterActual);
	}

	private serialize(parameter: ParameterDeclaration) {
		let p = JSON.parse(JSON.stringify(parameter));
		p.name = "";

		return JSON.stringify(p);
	}
}