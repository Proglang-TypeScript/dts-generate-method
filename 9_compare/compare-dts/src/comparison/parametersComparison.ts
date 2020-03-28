import { Difference } from "../difference/Difference";
import { Comparison } from "./comparison";
import { NamespaceDeclaration } from "../parsed-model/namespace";
import ParameterTypeDifference from "../difference/ParameterTypeDifference";
import { ParameterDeclaration } from "../parsed-model/parameter";
import { InterfaceDeclaration } from "../parsed-model/interface";
import { InterfaceComparison } from "./interfaceComparison";

export class ParametersComparison implements Comparison {
	private parameterExpected: ParameterDeclaration;
	private parameterActual: ParameterDeclaration;
	private parsedExpectedFile: NamespaceDeclaration;
	private parsedActualFile: NamespaceDeclaration;

	constructor(
		parameterExpected: ParameterDeclaration,
		parameterActual: ParameterDeclaration,
		parsedExpectedFile: NamespaceDeclaration,
		parsedActualFile: NamespaceDeclaration
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

	private getInterface(parameter: ParameterDeclaration, parsedFile: NamespaceDeclaration) : InterfaceDeclaration {
		if (parameter.type.kind !== "primitive_keyword") {
			return {
				name: "",
				properties: [],
				methods: [],
				classes: [],
				callSignatures: []
			}
		}

		let interfaceName = parameter.type.value;

		return this.searchInterface(interfaceName, parsedFile);
	}

	private searchInterface(interfaceName: string, parsedFile: NamespaceDeclaration) : InterfaceDeclaration {
		let i: InterfaceDeclaration = {
			name: "",
			properties: [],
			methods: [],
			classes: [],
			callSignatures: []
		};

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

	private areDifferent(parameterExpected: ParameterDeclaration, parameterActual: ParameterDeclaration) {
		return this.serialize(parameterExpected) !== this.serialize(parameterActual);
	}

	private serialize(parameter: ParameterDeclaration) {
		let p = JSON.parse(JSON.stringify(parameter));
		p.name = "";

		return JSON.stringify(p);
	}
}