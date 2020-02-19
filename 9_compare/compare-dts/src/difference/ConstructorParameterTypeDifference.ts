import { Difference } from "./Difference";

export class ConstructorParameterTypeDifference implements Difference {
	private parameterIndex: number;
	private parameterName: string;
	private expectedType: { [key: string]: any };
	private actualType: { [key: string]: any };

	constructor(parameterIndex: number, parameterName: string, expectedType: { [key: string]: any }, actualType: { [key: string]: any }) {
		this.parameterIndex = parameterIndex;
		this.parameterName = parameterName;
		this.expectedType = expectedType;
		this.actualType = actualType;
	}
}