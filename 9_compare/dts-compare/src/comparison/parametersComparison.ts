import Difference from '../difference/Difference';
import { Comparison } from './comparison';
import { DeclaredNamespace } from '../parser/model/DeclaredNamespace';
import ParameterTypeUnsolvableDifference from '../difference/ParameterTypeUnsolvableDifference';
import ParameterTypeSolvableDifference from '../difference/ParameterTypeSolvableDifference';
import { DeclaredProperty } from '../parser/model/DeclaredProperty';
import { DeclaredInterface } from '../parser/model/DeclaredInterface';
import { InterfaceComparison } from './interfaceComparison';
import { DeclaredPropertyTypeInterface } from '../parser/model/declared-property-types/DeclaredPropertyTypeInterface';
import { DeclaredPropertyTypeUnionType } from '../parser/model/declared-property-types/DeclaredPropertyTypeUnionType';
import DeclaredPropertyType from '../parser/model/declared-property-types/DeclaredPropertyType';
import { DeclaredPropertyTypeLiterals } from '../parser/model/declared-property-types/DeclaredPropertyTypeLiterals';
import { DeclaredPropertyTypePrimitiveKeyword } from '../parser/model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';

export class ParametersComparison implements Comparison {
  private parameterExpected: DeclaredProperty;
  private parameterActual: DeclaredProperty;
  private parsedExpectedFile: DeclaredNamespace;
  private parsedActualFile: DeclaredNamespace;

  constructor(
    parameterExpected: DeclaredProperty,
    parameterActual: DeclaredProperty,
    parsedExpectedFile: DeclaredNamespace,
    parsedActualFile: DeclaredNamespace,
  ) {
    this.parameterExpected = parameterExpected;
    this.parameterActual = parameterActual;
    this.parsedExpectedFile = parsedExpectedFile;
    this.parsedActualFile = parsedActualFile;
  }

  compare(): Difference[] {
    let differences: Difference[] = [];

    if (this.areDifferent(this.parameterExpected, this.parameterActual)) {
      differences = differences.concat(this.getDifference());
    }

    const interfaceParameterExpected = this.getInterface(this.parameterExpected);
    const interfaceParameterActual = this.getInterface(this.parameterActual);

    differences = differences.concat(
      new InterfaceComparison(
        interfaceParameterExpected,
        interfaceParameterActual,
        this.parsedExpectedFile,
        this.parsedActualFile,
      ).compare(),
    );

    return differences;
  }

  private getInterface(parameter: DeclaredProperty): DeclaredInterface {
    if (!(parameter.type instanceof DeclaredPropertyTypeInterface)) {
      return new DeclaredInterface('');
    }

    return parameter.type.value;
  }

  private areDifferent(parameterExpected: DeclaredProperty, parameterActual: DeclaredProperty) {
    if (
      parameterExpected.type instanceof DeclaredPropertyTypeInterface ||
      parameterActual.type instanceof DeclaredPropertyTypeInterface
    ) {
      return false;
    }

    return this.serialize(parameterExpected) !== this.serialize(parameterActual);
  }

  private serialize(parameter: DeclaredProperty) {
    const p = JSON.parse(JSON.stringify(parameter));
    p.name = '';

    return JSON.stringify(p);
  }

  private getDifference(): Difference {
    if (this.parameterExpected.type instanceof DeclaredPropertyTypeUnionType) {
      let actualTypes: DeclaredPropertyType[] = [];
      if (Array.isArray(this.parameterActual.type.value)) {
        actualTypes = actualTypes.concat(this.parameterActual.type.value);
      } else {
        actualTypes.push(this.parameterActual.type);
      }

      const expectedType = this.parameterExpected.type as DeclaredPropertyTypeUnionType;
      const expectedTypeValues = expectedType.value.map((t) => {
        if (t instanceof DeclaredPropertyTypeLiterals) {
          return this.getEquivalentTypeForLiteral(t);
        }

        return t;
      });

      const expectedContainsActualType =
        actualTypes.filter((actualType) => {
          return (
            expectedTypeValues.filter((typeOfUnion) => {
              return this.typesAreEqual(actualType, typeOfUnion);
            }).length > 0
          );
        }).length > 0;

      if (expectedContainsActualType === true) {
        return new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual);
      }
    }

    if (this.parameterExpected.optional === true) {
      if (
        this.typesAreEqual(this.parameterExpected.type, this.parameterActual.type) ||
        this.parameterActual.type.value === 'undefined'
      ) {
        return new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual);
      }
    }

    if (this.parameterExpected.type.value === 'any') {
      return new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual);
    }

    if (this.parameterExpected.type instanceof DeclaredPropertyTypeLiterals) {
      const equivalentType = this.getEquivalentTypeForLiteral(this.parameterExpected.type);
      if (this.typesAreEqual(equivalentType, this.parameterActual.type)) {
        return new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual);
      }
    }

    return new ParameterTypeUnsolvableDifference(this.parameterExpected, this.parameterActual);
  }

  private getEquivalentTypeForLiteral(
    declaredPropertyTypeLiterals: DeclaredPropertyTypeLiterals,
  ): DeclaredPropertyType {
    const literalValue = Function(`return ${declaredPropertyTypeLiterals.value};`)();
    const typeOfLiteralValue = typeof literalValue;

    const consideredValues = ['string', 'number', 'boolean'];
    if (consideredValues.indexOf(typeOfLiteralValue) !== -1) {
      return new DeclaredPropertyTypePrimitiveKeyword(typeOfLiteralValue);
    }

    return declaredPropertyTypeLiterals;
  }

  private typesAreEqual(a: DeclaredPropertyType, b: DeclaredPropertyType): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
