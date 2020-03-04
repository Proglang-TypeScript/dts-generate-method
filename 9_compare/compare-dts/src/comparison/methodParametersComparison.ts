import { Difference } from "../difference/Difference";
import { Comparison } from "./comparison";
import { MethodDeclaration } from "../parsed-model/method";
import { NamespaceDeclaration } from "../parsed-model/namespace";
import { ParametersComparison } from "./parametersComparison";

export class MethodParametersComparison implements Comparison {
	private methodExpected: MethodDeclaration;
	private methodActual: MethodDeclaration;
	private parsedExpectedFile: NamespaceDeclaration;
	private parsedActualFile: NamespaceDeclaration;

	constructor(
		methodExpected: MethodDeclaration,
		methodActual: MethodDeclaration,
		parsedExpectedFile: NamespaceDeclaration,
		parsedActualFile: NamespaceDeclaration
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