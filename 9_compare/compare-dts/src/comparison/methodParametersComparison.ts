import Difference from "../difference/Difference";
import { Comparison } from "./comparison";
import { DeclaredFunction } from "../parser/model/DeclaredFunction";
import { DeclaredNamespace } from "../parser/model/DeclaredNamespace";
import { ParametersComparison } from "./parametersComparison";

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

		for (let i = 0; i < Math.min(parametersExpected.length, parametersActual.length); i++) {
			let parameterExpected = parametersExpected[i];
			let parameterActual = parametersActual[i];

			differences = differences.concat(
				new ParametersComparison(
					parameterExpected,
					parameterActual,
					this.parsedExpectedFile,
					this.parsedActualFile
				).compare()
			);
		}

		return differences;
	}
}