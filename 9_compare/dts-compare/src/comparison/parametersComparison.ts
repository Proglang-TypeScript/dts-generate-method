import Difference from "../difference/Difference";
import { Comparison } from "./comparison";
import { DeclaredNamespace } from "../parser/model/DeclaredNamespace";
import ParameterTypeEmptyIntersectionDifference from "../difference/ParameterTypeEmptyIntersectionDifference";
import ParameterTypeNonEmptyIntersectionDifference from "../difference/ParameterTypeNonEmptyIntersectionDifference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";
import { DeclaredInterface } from "../parser/model/DeclaredInterface";
import { InterfaceComparison } from "./interfaceComparison";
import { DeclaredPropertyTypeInterface } from "../parser/model/declared-property-types/DeclaredPropertyTypeInterface";
import { DeclaredPropertyTypeUnionType } from "../parser/model/declared-property-types/DeclaredPropertyTypeUnionType";
import DeclaredPropertyType from "../parser/model/declared-property-types/DeclaredPropertyType";

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
			differences = differences.concat(this.getDifference());
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

	private getDifference(): Difference {
		if (this.parameterExpected.type instanceof DeclaredPropertyTypeUnionType) {
			let actualTypes: DeclaredPropertyType[] = [];
			if (Array.isArray(this.parameterActual.type.value)) {
				actualTypes = actualTypes.concat(this.parameterActual.type.value);
			} else {
				actualTypes.push(this.parameterActual.type);
			}

			const expectedType = this.parameterExpected.type as DeclaredPropertyTypeUnionType;
			const expectedContainsActualType = actualTypes.filter(actualType => {
				return expectedType.value.filter(typeOfUnion => {
					return this.typesAreEqual(actualType, typeOfUnion);
				}).length > 0;
			}).length > 0;

			if (expectedContainsActualType === true) {
				return new ParameterTypeNonEmptyIntersectionDifference(
					this.parameterExpected,
					this.parameterActual
				);
			}
		}

		return new ParameterTypeEmptyIntersectionDifference(
			this.parameterExpected,
			this.parameterActual
		);
	}

	private typesAreEqual(a: DeclaredPropertyType, b: DeclaredPropertyType): boolean {
		return (JSON.stringify(a) === JSON.stringify(b));
	}
}