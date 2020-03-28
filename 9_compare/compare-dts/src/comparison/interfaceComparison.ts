import Difference from "../difference/Difference";
import { Comparison } from "./comparison";
import { NamespaceDeclaration } from "../parsed-model/namespace";
import { InterfaceDeclaration } from "../parsed-model/interface";
import { ParametersComparison } from "./parametersComparison";

export class InterfaceComparison implements Comparison {
	private interfaceExpected: InterfaceDeclaration;
	private interfaceActual: InterfaceDeclaration;
	private parsedExpectedFile: NamespaceDeclaration;
	private parsedActualFile: NamespaceDeclaration;

	constructor(
		interfaceExpected: InterfaceDeclaration,
		interfaceActual: InterfaceDeclaration,
		parsedExpectedFile: NamespaceDeclaration,
		parsedActualFile: NamespaceDeclaration
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