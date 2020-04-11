import Severity from "./Severity";

export default class HighSeverity implements Severity {
	getCode(): string {
		return "high";
	};

	getScore(): number {
		return 100;
	}
}