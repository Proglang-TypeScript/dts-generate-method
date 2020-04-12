import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

export default class ParameterMissingDifference implements Difference {
	private parameterMissing: DeclaredProperty;

	static CODE = "missing-parameter";

	code = ParameterMissingDifference.CODE;

	constructor(parameterMissing: DeclaredProperty) {
		this.parameterMissing = parameterMissing;
	}
}