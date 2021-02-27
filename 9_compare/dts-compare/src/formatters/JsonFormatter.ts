import { ResultComparison } from '../Comparator';
import Formatter from './Formatter';

export default class JsonFormatter implements Formatter {
  format(comparedModule: string, r: ResultComparison, tags: Set<string>): string {
    const output = {
      ...{ module: comparedModule },
      ...r,
      ...{ tags: Array.from(tags.values()) },
    };

    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key: string, value: any) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return { name: value.name, circular: true };
          }
          seen.add(value);
        }
        return value;
      };
    };

    return JSON.stringify(output, getCircularReplacer(), 4);
  }
}
