import { ResultComparison } from '../Comparator';
import { Histogram } from '../parser/Histogram';

export default interface Formatter {
  format(comparedModule: string, r: ResultComparison, tags: Histogram): string;
}
