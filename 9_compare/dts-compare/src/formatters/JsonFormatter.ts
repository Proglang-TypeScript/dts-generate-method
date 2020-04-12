import { ResultComparison } from "../Comparator";
import Formatter from "./Formatter";

export default class JsonFormatter implements Formatter {
	format(comparedModule: string, r: ResultComparison) : string {
		const output = {
			...{module: comparedModule},
			...r
		};

		return JSON.stringify(output, null, 4);
	}
}