import { ResultComparison } from "../Comparator";
import Formatter from "./Formatter";
import ParameterTypeSolvableDifference from "../difference/ParameterTypeSolvableDifference";
import ParameterTypeUnsolvableDifference from "../difference/ParameterTypeUnsolvableDifference";
import ParameterExtraDifference from "../difference/ParameterExtraDifference";
import ParameterMissingDifference from "../difference/ParameterMissingDifference";
import TemplateDifference from "../difference/TemplateDifference";
import FunctionMissingDifference from "../difference/FunctionMissingDifference";
import FunctionExtraDifference from "../difference/FunctionExtraDifference";
import FunctionOverloadingDifference from "../difference/FunctionOverloadingDifference";
import ExportAssignmentDifference from "../difference/ExportAssignmentDifference";
import TAGS from "../parser/tags/tags";

export default class CSVFormatter implements Formatter {
	format(comparedModule: string, r: ResultComparison, tags: Set<string>) : string {
		let line : string[] = [];

		const differencesInCsv : { [k: string] : number } = {};
		differencesInCsv[TemplateDifference.CODE] =  0;
		differencesInCsv[ParameterTypeSolvableDifference.CODE] =  0;
		differencesInCsv[ParameterTypeUnsolvableDifference.CODE] =  0;
		differencesInCsv[ParameterExtraDifference.CODE] =  0;
		differencesInCsv[ParameterMissingDifference.CODE] = 0;
		differencesInCsv[FunctionMissingDifference.CODE] = 0;
		differencesInCsv[FunctionExtraDifference.CODE] = 0;
		differencesInCsv[FunctionOverloadingDifference.CODE] = 0;
		differencesInCsv[ExportAssignmentDifference.CODE] = 0;

		r.differences.forEach(d => {
			if (d.code in differencesInCsv) {
				differencesInCsv[d.code]++;
			}
		});

		line.push(comparedModule);
		line.push(r.template);
		line = line.concat(Object.values(differencesInCsv).map(v => String(v)));

		this.getTags().forEach(t => {
			line.push(tags.has(t) ? '1' : '0');
		});

		return line.join(',');
	}

	private getTags() : TAGS[] {
		return [
			TAGS.OPTIONAL,
			TAGS.ANY,
			TAGS.ALIAS,
			TAGS.LITERALS,
			TAGS.ARRAY,
			TAGS.FUNCTION,
			TAGS.TUPLE,
			TAGS.INDEX_SIGNATURE,
			TAGS.GENERICS_FUNCTION,
			TAGS.GENERICS_CLASS,
			TAGS.GENERICS_INTERFACE,
			TAGS.UNDEFINED,
			TAGS.PRIVATE,
			TAGS.PROTECTED,
			TAGS.STATIC,
			TAGS.READONLY,
			TAGS.PUBLIC,
			TAGS.DOT_DOT_DOT_TOKEN,
			TAGS.INTERSECTION,
			TAGS.CALL_SIGNATURE,
		];
	}
}