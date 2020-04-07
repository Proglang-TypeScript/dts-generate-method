import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

export default class ParameterExtraDifference implements Difference {
	private parameterExtra: DeclaredProperty;

	constructor(parameterExtra: DeclaredProperty) {
		this.parameterExtra = parameterExtra;
	}
}