import Difference from "./Difference";
import { DeclaredFunction } from "../parser/model/DeclaredFunction";

export default class FunctionExtraDifference implements Difference {
	private functionActual: DeclaredFunction;

	static CODE = "function-extra";

	code = FunctionExtraDifference.CODE;

	constructor(functionActual: DeclaredFunction) {
		this.functionActual = functionActual;
	}
}