import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";
import Severity from "../severity/Severity";
import LowSeverity from "../severity/LowSeverity";
import { DeclaredPropertyTypeUnionType } from "../parser/model/declared-property-types/DeclaredPropertyTypeUnionType";
import DeclaredPropertyType from "../parser/model/declared-property-types/DeclaredPropertyType";
import CriticalSeverity from "../severity/CriticalSeverity";

export default class ParameterTypeDifference implements Difference {
	private parameterExpected: DeclaredProperty;
	private parameterActual: DeclaredProperty;

	constructor(parameterExpected: DeclaredProperty, parameterActual: DeclaredProperty) {
		this.parameterExpected = parameterExpected;
		this.parameterActual = parameterActual;
	}

	getSeverity(): Severity {
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
				return new LowSeverity();
			}
		}

		return new CriticalSeverity();
	}

	private typesAreEqual(a: DeclaredPropertyType, b: DeclaredPropertyType) : boolean {
		return (JSON.stringify(a) === JSON.stringify(b));
	}
}