import Difference from "../difference/Difference";
import { Comparison } from "./comparison";
import { DeclaredNamespace } from "../parser/model/DeclaredNamespace";
import { DeclaredInterface } from "../parser/model/DeclaredInterface";
import { ParametersComparison } from "./parametersComparison";
import ParameterMissingDifference from "../difference/ParameterMissingDifference"
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

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

		let propertiesExpected = new Map();
		this.interfaceExpected.properties.forEach(propertyExpected => {
			propertiesExpected.set(propertyExpected.name, propertyExpected);
		});

		let propertiesActual = new Map();
		this.interfaceActual.properties.forEach(propertyActual => {
			propertiesActual.set(propertyActual.name, propertyActual);
		});

		propertiesExpected.forEach((propertyExpected, nameExpected) => {
			if (!propertiesActual.has(nameExpected)) {
				differences = differences.concat(new ParameterMissingDifference(propertyExpected));
			} else {
				differences = differences.concat(
					new ParametersComparison(
						propertyExpected,
						propertiesActual.get(nameExpected),
						this.parsedExpectedFile,
						this.parsedActualFile
					).compare()
				);
			}
		});

		return differences;
	}
}