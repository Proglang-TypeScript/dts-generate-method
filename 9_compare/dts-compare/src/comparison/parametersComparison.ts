import Difference from "../difference/Difference";
import { Comparison } from "./comparison";
import { DeclaredNamespace } from "../parser/model/DeclaredNamespace";
import ParameterTypeDifference from "../difference/ParameterTypeDifference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";
import { DeclaredInterface } from "../parser/model/DeclaredInterface";
import { InterfaceComparison } from "./interfaceComparison";

export class ParametersComparison implements Comparison {
	private parameterExpected: DeclaredProperty;
	private parameterActual: DeclaredProperty;
	private parsedExpectedFile: DeclaredNamespace;
	private parsedActualFile: DeclaredNamespace;

	constructor(
		parameterExpected: DeclaredProperty,
		parameterActual: DeclaredProperty,
		parsedExpectedFile: DeclaredNamespace,
		parsedActualFile: DeclaredNamespace
	) {
		this.parameterExpected = parameterExpected;
		this.parameterActual = parameterActual;
		this.parsedExpectedFile = parsedExpectedFile;
		this.parsedActualFile = parsedActualFile;
	}

	compare() : Difference[] {
		let differences : Difference[] = [];

		if (this.areDifferent(this.parameterExpected, this.parameterActual)) {
			differences = differences.concat(new ParameterTypeDifference(
				this.parameterExpected,
				this.parameterActual
			));
		}

		let interfaceParameterExpected = this.getInterface(this.parameterExpected, this.parsedExpectedFile);
		let interfaceParameterActual = this.getInterface(this.parameterActual, this.parsedActualFile);
	
		differences = differences.concat(
			new InterfaceComparison(
				interfaceParameterExpected,
				interfaceParameterActual,
				this.parsedExpectedFile,
				this.parsedActualFile
			).compare()
		);

		return differences;
	}

	private getInterface(parameter: DeclaredProperty, parsedFile: DeclaredNamespace) : DeclaredInterface {
		if (parameter.type.kind !== "primitive_keyword") {
			return new DeclaredInterface("");
		}

		let interfaceName = parameter.type.value;

		return this.searchInterface(interfaceName, parsedFile);
	}

	private searchInterface(interfaceName: string, parsedFile: DeclaredNamespace) : DeclaredInterface {
		let i = new DeclaredInterface("");

		let interfaceNameSplittedByNamespaceSeparator = interfaceName.split(".");
		let interfaceNameWithoutNamespaces = interfaceNameSplittedByNamespaceSeparator[interfaceNameSplittedByNamespaceSeparator.length - 1];
		let interfaceNamespacesPath = interfaceNameSplittedByNamespaceSeparator.splice(0, interfaceNameSplittedByNamespaceSeparator.length - 1);

		let currentNamespace = parsedFile;
		interfaceNamespacesPath.forEach(namespace => {
			currentNamespace = parsedFile.namespaces[namespace] || currentNamespace;
		});

		currentNamespace.interfaces.forEach(v => {
			if (v.name === interfaceNameWithoutNamespaces) {
				i = v;
				return;
			}
		});

		return i;
	}

	private areDifferent(parameterExpected: DeclaredProperty, parameterActual: DeclaredProperty) {
		return this.serialize(parameterExpected) !== this.serialize(parameterActual);
	}

	private serialize(parameter: DeclaredProperty) {
		let p = JSON.parse(JSON.stringify(parameter));
		p.name = "";

		return JSON.stringify(p);
	}
}