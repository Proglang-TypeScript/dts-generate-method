import Difference from "../difference/Difference";
import { Comparison } from "./comparison";
import { DeclaredFunction } from "../parser/model/DeclaredFunction";
import { DeclaredNamespace } from "../parser/model/DeclaredNamespace";
import { ParametersComparison } from "./parametersComparison";
import ParameterMissingDifference from "../difference/ParameterMissingDifference";
import ParameterExtraDifference from "../difference/ParameterExtraDifference";

export class MethodParametersComparison implements Comparison {
	private methodExpected: DeclaredFunction;
	private methodActual: DeclaredFunction;
	private parsedExpectedFile: DeclaredNamespace;
	private parsedActualFile: DeclaredNamespace;

	constructor(
		methodExpected: DeclaredFunction,
		methodActual: DeclaredFunction,
		parsedExpectedFile: DeclaredNamespace,
		parsedActualFile: DeclaredNamespace
	) {
		this.methodExpected = methodExpected;
		this.methodActual = methodActual;
		this.parsedExpectedFile = parsedExpectedFile;
		this.parsedActualFile = parsedActualFile;
	}

	compare() : Difference[] {
		let parametersActual = this.methodActual.parameters;
		let parametersExpected = this.methodExpected.parameters;

		let differences: Difference[] = [];

		for (let i = 0; i < Math.max(parametersExpected.length, parametersActual.length); i++) {
			const parameterExpected = parametersExpected[i];
			const parameterActual = parametersActual[i];

			if (parameterExpected && parameterActual) {
				differences = differences.concat(
					new ParametersComparison(
						parameterExpected,
						parameterActual,
						this.parsedExpectedFile,
						this.parsedActualFile
					).compare()
				);

				continue;
			}

			if (parameterExpected && !parameterActual) {
				differences = differences.concat(new ParameterMissingDifference(parameterExpected));
				continue;
			}

			if (!parameterExpected && parameterActual) {
				differences = differences.concat(new ParameterExtraDifference(parameterActual));
				continue;
			}
		}

		return differences;
	}
}