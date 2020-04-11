import Severity from "../severity/Severity";

export default interface Difference {
	getSeverity(): Severity;
}