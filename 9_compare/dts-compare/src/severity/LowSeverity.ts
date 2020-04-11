import Severity from "./Severity";

export default class LowSeverity implements Severity {
	getCode(): string {
		return "low";
	};

	getScore(): number {
		return 1;
	}
}