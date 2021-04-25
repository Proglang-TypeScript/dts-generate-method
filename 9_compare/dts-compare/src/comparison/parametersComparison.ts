import Difference from '../difference/Difference';
import { Comparison } from './comparison';
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
import { DeclaredPropertyTypeFunctionType } from '../parser/model/declared-property-types/DeclaredPropertyTypeFunctionType';
import { FunctionParametersComparison } from './functionParametersComparison';
import { DeclaredPropertyArrayType } from '../parser/model/declared-property-types/DeclaredPropertyArrayType';
import { DeclaredPropertyTypeReferenceType } from '../parser/model/declared-property-types/DeclaredPropertyTypeReferenceType';
import { DeclaredPropertyTypeUndefinedKeyword } from '../parser/model/declared-property-types/DeclaredPropertyTypeUndefinedKeyword';
import { serialize } from '../utils/serialize';

export class ParametersComparison implements Comparison {
  private parameterExpected: DeclaredProperty;
  private parameterActual: DeclaredProperty;

  constructor(parameterExpected: DeclaredProperty, parameterActual: DeclaredProperty) {
    this.parameterExpected = parameterExpected;
    this.parameterActual = parameterActual;
  }

  compare(): Difference[] {
    let differences: Difference[] = [];

    if (this.areDifferent(this.parameterExpected, this.parameterActual)) {
      differences = differences.concat(this.getDifference());
    }

    const interfaceParameterExpected = this.getInterface(this.parameterExpected);
    const interfaceParameterActual = this.getInterface(this.parameterActual);

    differences = differences.concat(
      new InterfaceComparison(interfaceParameterExpected, interfaceParameterActual).compare(),
    );

    return differences;
  }

  private getInterface(parameter: DeclaredProperty): DeclaredInterface {
    if (!(parameter.type instanceof DeclaredPropertyTypeInterface)) {
      return new DeclaredInterface('');
    }

    return parameter.type.value;
  }

  private areDifferent(
    parameterExpected: DeclaredProperty,
    parameterActual: DeclaredProperty,
  ): boolean {
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

  private getDifference(): Difference[] {
    const differencesOptionalType = this.compareOptionalType(
      this.parameterExpected,
      this.parameterActual,
    );
    if (differencesOptionalType) {
      return differencesOptionalType;
    }

    const differencesUnionType = this.compareUnionType(
      this.parameterExpected,
      this.parameterActual,
    );
    if (differencesUnionType) {
      return differencesUnionType;
    }

    if (this.parameterExpected.type.value === 'any' || this.parameterActual.type.value === 'any') {
      return [new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual)];
    }

    if (this.parameterExpected.type instanceof DeclaredPropertyTypeLiterals) {
      const equivalentType = this.getEquivalentTypeForLiteral(this.parameterExpected.type);
      if (this.typesAreEqual(equivalentType, this.parameterActual.type)) {
        return [new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual)];
      }
    }

    if (this.parameterExpected.type instanceof DeclaredPropertyTypeFunctionType) {
      if (
        this.parameterActual.type instanceof DeclaredPropertyTypeReferenceType &&
        this.parameterActual.type.value === 'Function'
      ) {
        return [new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual)];
      }

      if (this.parameterActual.type instanceof DeclaredPropertyTypeFunctionType) {
        return new FunctionParametersComparison(
          this.parameterExpected.type.value,
          this.parameterActual.type.value,
        ).compare();
      }
    }

    if (this.parameterExpected.type instanceof DeclaredPropertyArrayType) {
      return new ParametersComparison(
        new DeclaredProperty(this.parameterExpected.name, this.parameterExpected.type.value),
        new DeclaredProperty(this.parameterActual.name, this.parameterActual.type.value),
      ).compare();
    }

    return [new ParameterTypeUnsolvableDifference(this.parameterExpected, this.parameterActual)];
  }

  private getEquivalentForOptional(optionalProperty: DeclaredProperty): DeclaredProperty {
    let newUnionType: DeclaredPropertyTypeUnionType;
    if (optionalProperty.type instanceof DeclaredPropertyTypeUnionType) {
      newUnionType = new DeclaredPropertyTypeUnionType(optionalProperty.type.value);
    } else {
      newUnionType = new DeclaredPropertyTypeUnionType(
        ([] as DeclaredPropertyType[]).concat(optionalProperty.type),
      );
    }

    newUnionType.value.push(new DeclaredPropertyTypeUndefinedKeyword());

    return new DeclaredProperty(optionalProperty.name, newUnionType, false);
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
    return serialize(a) === serialize(b);
  }

  private getTypesAsArray(t: DeclaredPropertyType): DeclaredPropertyType[] {
    let actualTypes: DeclaredPropertyType[] = [];
    if (Array.isArray(t.value)) {
      actualTypes = actualTypes.concat(t.value);
    } else {
      actualTypes.push(t);
    }

    return actualTypes;
  }

  private compareUnionType(
    parameterExpected: DeclaredProperty,
    parameterActual: DeclaredProperty,
  ): Difference[] | undefined {
    if (parameterExpected.type instanceof DeclaredPropertyTypeUnionType) {
      const actualTypesArray = this.getTypesAsArray(parameterActual.type);

      if (
        this.allActualTypesAreInTheExpectedTypes(parameterExpected.type.value, actualTypesArray)
      ) {
        return parameterExpected.type.value.length === actualTypesArray.length
          ? []
          : [new ParameterTypeSolvableDifference(parameterExpected, parameterActual)];
      }

      const expectedTypesWithEquivalentForLiterals = parameterExpected.type.value.map((t) => {
        if (t instanceof DeclaredPropertyTypeLiterals) {
          return this.getEquivalentTypeForLiteral(t);
        }

        return t;
      });

      if (
        this.allActualTypesAreInTheExpectedTypes(
          expectedTypesWithEquivalentForLiterals,
          actualTypesArray,
        )
      ) {
        return [new ParameterTypeSolvableDifference(parameterExpected, parameterActual)];
      }
    }
  }

  private compareOptionalType(
    expectedType: DeclaredProperty,
    actualType: DeclaredProperty,
  ): Difference[] | undefined {
    if (expectedType.optional) {
      if (
        new ParametersComparison(this.getEquivalentForOptional(expectedType), actualType).compare()
          .length === 0
      ) {
        return [];
      }
    }

    if (actualType.optional) {
      if (
        new ParametersComparison(expectedType, this.getEquivalentForOptional(actualType)).compare()
          .length === 0
      ) {
        return [];
      }
    }

    if (expectedType.optional === true) {
      if (
        this.typesAreEqual(expectedType.type, actualType.type) ||
        actualType.type.value === 'undefined'
      ) {
        return [new ParameterTypeSolvableDifference(expectedType, actualType)];
      }
    }
  }

  private allActualTypesAreInTheExpectedTypes(
    expectedTypes: DeclaredPropertyType[],
    actualTypes: DeclaredPropertyType[],
  ): boolean {
    const expectedTypesSet = new Set<string>(Array.from(expectedTypes.map((e) => serialize(e))));

    return actualTypes.every((a) => expectedTypesSet.has(serialize(a)));
  }
}
