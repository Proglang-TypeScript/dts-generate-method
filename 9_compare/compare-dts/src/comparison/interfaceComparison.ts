import Difference from "../difference/Difference";
import { Comparison } from "./comparison";
import { DeclaredNamespace } from "../parser/model/DeclaredNamespace";
import { DeclaredInterface } from "../parser/model/DeclaredInterface";
import { ParametersComparison } from "./parametersComparison";

export class InterfaceComparison implements Comparison {
	private interfaceExpected: DeclaredInterface;
	private interfaceActual: DeclaredInterface;
	private parsedExpectedFile: DeclaredNamespace;
	private parsedActualFile: DeclaredNamespace;

	constructor(
		interfaceExpected: DeclaredInterface,
		interfaceActual: DeclaredInterface,
		parsedExpectedFile: DeclaredNamespace,
		parsedActualFile: DeclaredNamespace
	) {
		this.interfaceExpected = interfaceExpected;
		this.interfaceActual = interfaceActual;
		this.parsedExpectedFile = parsedExpectedFile;
		this.parsedActualFile = parsedActualFile;
	}

	compare() : Difference[] {
		let differences: Difference[] = [];

		this.interfaceExpected.properties.forEach(propertyExpected => {
			this.interfaceActual.properties.forEach(propertyActual => {
				if (propertyExpected.name === propertyActual.name) {
					differences = differences.concat(
						new ParametersComparison(
							propertyExpected,
							propertyActual,
							this.parsedExpectedFile,
							this.parsedActualFile
						).compare()
					);
				}
			})
		})

		return differences;
	}
}