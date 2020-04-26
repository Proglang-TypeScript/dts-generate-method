import { ResultComparison } from "../Comparator";
import Formatter from "./Formatter";

export default class JsonFormatter implements Formatter {
	format(comparedModule: string, r: ResultComparison, tags: Set<string>) : string {
		const output = {
			...{module: comparedModule},
			...r,
			...{tags: Array.from(tags.values())}
		};

		return JSON.stringify(output, null, 4);
	}
}