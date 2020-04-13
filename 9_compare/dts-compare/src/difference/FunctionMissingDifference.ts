import Difference from "./Difference";
import { DeclaredFunction } from "../parser/model/DeclaredFunction";

export default class FunctionMissingDifference implements Difference {
	private functionExpected: DeclaredFunction;

	static CODE = "function-missing";

	code = FunctionMissingDifference.CODE;

	constructor(functionExpected: DeclaredFunction) {
		this.functionExpected = functionExpected;
	}
}