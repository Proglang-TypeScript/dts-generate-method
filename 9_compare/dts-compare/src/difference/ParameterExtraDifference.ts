import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";
import Severity from "../severity/Severity";
import HighSeverity from "../severity/HighSeverity";

export default class ParameterExtraDifference implements Difference {
	private parameterExtra: DeclaredProperty;

	constructor(parameterExtra: DeclaredProperty) {
		this.parameterExtra = parameterExtra;
	}

	getSeverity(): Severity {
		return new HighSeverity();
	}
}