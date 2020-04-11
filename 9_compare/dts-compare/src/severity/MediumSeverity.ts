import Severity from "./Severity";

export default class MediumSeverity implements Severity {
	getCode(): string {
		return "medium";
	};

	getScore(): number {
		return 10;
	}
}