import Severity from "./Severity";

export default class CriticalSeverity implements Severity {
	getCode(): string {
		return "critical";
	};

	getScore(): number {
		return 1000;
	}
}