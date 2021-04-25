import Difference from '../difference/Difference';
import { Comparison } from './comparison';
import { DeclaredInterface } from '../parser/model/DeclaredInterface';
import { ParametersComparison } from './parametersComparison';
import ParameterMissingDifference from '../difference/ParameterMissingDifference';
import ParameterExtraDifference from '../difference/ParameterExtraDifference';

export class InterfaceComparison implements Comparison {
  private interfaceExpected: DeclaredInterface;
  private interfaceActual: DeclaredInterface;

  constructor(interfaceExpected: DeclaredInterface, interfaceActual: DeclaredInterface) {
    this.interfaceExpected = interfaceExpected;
    this.interfaceActual = interfaceActual;
  }

  compare(): Difference[] {
    let differences: Difference[] = [];

    const propertiesExpected = new Map();
    this.interfaceExpected.properties.forEach((propertyExpected) => {
      propertiesExpected.set(propertyExpected.name, propertyExpected);
    });

    const propertiesActual = new Map();
    this.interfaceActual.properties.forEach((propertyActual) => {
      propertiesActual.set(propertyActual.name, propertyActual);
    });

    propertiesExpected.forEach((propertyExpected, nameExpected) => {
      if (!propertiesActual.has(nameExpected)) {
        differences = differences.concat(new ParameterMissingDifference(propertyExpected));
      } else {
        differences = differences.concat(
          new ParametersComparison(propertyExpected, propertiesActual.get(nameExpected)).compare(),
        );
      }
    });

    propertiesActual.forEach((propertyActual, nameActual) => {
      if (!propertiesExpected.has(nameActual)) {
        differences = differences.concat(new ParameterExtraDifference(propertyActual));
      }
    });

    return differences;
  }
}
