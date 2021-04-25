import Difference from '../difference/Difference';
import { Comparison } from './comparison';
import { DeclaredFunction } from '../parser/model/DeclaredFunction';
import { ParametersComparison } from './parametersComparison';
import ParameterMissingDifference from '../difference/ParameterMissingDifference';
import ParameterExtraDifference from '../difference/ParameterExtraDifference';

export class FunctionParametersComparison implements Comparison {
  private functionExpected: DeclaredFunction;
  private functionActual: DeclaredFunction;

  constructor(functionExpected: DeclaredFunction, functionActual: DeclaredFunction) {
    this.functionExpected = functionExpected;
    this.functionActual = functionActual;
  }

  compare(): Difference[] {
    const parametersActual = this.functionActual.parameters;
    const parametersExpected = this.functionExpected.parameters;

    let differences: Difference[] = [];

    for (let i = 0; i < Math.max(parametersExpected.length, parametersActual.length); i++) {
      const parameterExpected = parametersExpected[i];
      const parameterActual = parametersActual[i];

      if (parameterExpected && parameterActual) {
        differences = differences.concat(
          new ParametersComparison(parameterExpected, parameterActual).compare(),
        );

        continue;
      }

      if (parameterExpected && !parameterActual) {
        differences = differences.concat(new ParameterMissingDifference(parameterExpected));
        continue;
      }

      if (!parameterExpected && parameterActual) {
        differences = differences.concat(new ParameterExtraDifference(parameterActual));
        continue;
      }
    }

    return differences;
  }
}
