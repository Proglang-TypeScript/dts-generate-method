import Difference from "./Difference";

export default class TemplateDifference implements Difference {
	private templateExpected: string;
	private templateActual: string;

	static CODE = "template-is-different";

	code = TemplateDifference.CODE;

	constructor(templateExpected: string, templateActual: string) {
		this.templateExpected = templateExpected;
		this.templateActual = templateActual;
	}
}