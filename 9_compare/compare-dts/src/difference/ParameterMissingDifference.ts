import Difference from "./Difference";
import { DeclaredProperty } from "../parser/model/DeclaredProperty";

export default class ParameterTypeDifference implements Difference {
	private parameterMissing: DeclaredProperty;

	constructor(parameterMissing: DeclaredProperty) {
		this.parameterMissing = parameterMissing;
	}
}