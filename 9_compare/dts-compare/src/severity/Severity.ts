export default interface Severity {
	getCode(): string;
	getScore(): number;
}