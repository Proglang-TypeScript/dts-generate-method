import Difference from "../difference/Difference";
import { Comparison } from "./comparison";
import { DeclaredNamespace } from "../parser/model/DeclaredNamespace";
import ParameterTypeDifference from "../difference/ParameterTypeDifference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";
import { DeclaredInterface } from "../parser/model/DeclaredInterface";
import { InterfaceComparison } from "./interfaceComparison";
import { DeclaredPropertyTypeInterface } from "../parser/model/declared-property-types/DeclaredPropertyTypeInterface";

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
		if (!(parameter.type instanceof DeclaredPropertyTypeInterface)) {
			return new DeclaredInterface("");
		}

		return parameter.type.value;
	}

	private areDifferent(parameterExpected: DeclaredProperty, parameterActual: DeclaredProperty) {
		if (parameterExpected.type instanceof DeclaredPropertyTypeInterface || parameterActual.type instanceof DeclaredPropertyTypeInterface) {
			return false;
		}

		return this.serialize(parameterExpected) !== this.serialize(parameterActual);
	}

	private serialize(parameter: DeclaredProperty) {
		let p = JSON.parse(JSON.stringify(parameter));
		p.name = "";

		return JSON.stringify(p);
	}
}