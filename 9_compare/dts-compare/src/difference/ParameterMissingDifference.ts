import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";
import Severity from "../severity/Severity";
import LowSeverity from "../severity/LowSeverity";

export default class ParameterMissingDifference implements Difference {
	private parameterMissing: DeclaredProperty;

	constructor(parameterMissing: DeclaredProperty) {
		this.parameterMissing = parameterMissing;
	}

	getSeverity(): Severity {
		return new LowSeverity();
	}
}