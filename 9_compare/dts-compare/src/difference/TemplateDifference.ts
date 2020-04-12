import Difference from "./Difference";

export default class TemplateDifference implements Difference {
	private templateExpected: string;
	private templateActual: string;

	code = "template-is-different";

	constructor(templateExpected: string, templateActual: string) {
		this.templateExpected = templateExpected;
		this.templateActual = templateActual;
	}
}