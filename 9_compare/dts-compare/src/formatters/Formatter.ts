import { ResultComparison } from "../Comparator";

export default interface Formatter {
	format(comparedModule: string, r: ResultComparison): string;
}