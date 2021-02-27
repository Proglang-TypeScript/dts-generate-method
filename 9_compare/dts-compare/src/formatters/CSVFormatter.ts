import { ResultComparison } from '../Comparator';
import Formatter from './Formatter';
import ParameterTypeSolvableDifference from '../difference/ParameterTypeSolvableDifference';
import ParameterTypeUnsolvableDifference from '../difference/ParameterTypeUnsolvableDifference';
import ParameterExtraDifference from '../difference/ParameterExtraDifference';
import ParameterMissingDifference from '../difference/ParameterMissingDifference';
import TemplateDifference from '../difference/TemplateDifference';
import FunctionMissingDifference from '../difference/FunctionMissingDifference';
import FunctionExtraDifference from '../difference/FunctionExtraDifference';
import FunctionOverloadingDifference from '../difference/FunctionOverloadingDifference';
import ExportAssignmentDifference from '../difference/ExportAssignmentDifference';

export default class CSVFormatter implements Formatter {
  format(comparedModule: string, r: ResultComparison, tags: Set<string>): string {
    let line: string[] = [];

    const differencesInCsv: { [k: string]: number } = {};
    differencesInCsv[TemplateDifference.CODE] = 0;
    differencesInCsv[ParameterTypeSolvableDifference.CODE] = 0;
    differencesInCsv[ParameterTypeUnsolvableDifference.CODE] = 0;
    differencesInCsv[ParameterExtraDifference.CODE] = 0;
    differencesInCsv[ParameterMissingDifference.CODE] = 0;
    differencesInCsv[FunctionMissingDifference.CODE] = 0;
    differencesInCsv[FunctionExtraDifference.CODE] = 0;
    differencesInCsv[FunctionOverloadingDifference.CODE] = 0;
    differencesInCsv[ExportAssignmentDifference.CODE] = 0;

    r.differences.forEach((d) => {
      if (d.code in differencesInCsv) {
        differencesInCsv[d.code]++;
      }
    });

    line.push(comparedModule);
    line.push(r.template);
    line = line.concat(Object.values(differencesInCsv).map((v) => String(v)));

    return line.join(',');
  }
}
