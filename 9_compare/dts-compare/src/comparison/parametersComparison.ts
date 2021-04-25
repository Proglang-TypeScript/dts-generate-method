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
import { DeclaredPropertyTypeFunctionType } from '../parser/model/declared-property-types/DeclaredPropertyTypeFunctionType';
import { FunctionParametersComparison } from './functionParametersComparison';
import { DeclaredPropertyArrayType } from '../parser/model/declared-property-types/DeclaredPropertyArrayType';
import { DeclaredPropertyTypeReferenceType } from '../parser/model/declared-property-types/DeclaredPropertyTypeReferenceType';
import { DeclaredPropertyTypeUndefinedKeyword } from '../parser/model/declared-property-types/DeclaredPropertyTypeUndefinedKeyword';
import { serialize } from '../utils/serialize';

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
    if (this.parameterExpected.optional) {
      if (
        new ParametersComparison(
          this.getEquivalentForOptional(this.parameterExpected),
          this.parameterActual,
          this.parsedExpectedFile,
          this.parsedActualFile,
        ).compare().length === 0
      ) {
        return [];
      }
    }

    if (this.parameterActual.optional) {
      if (
        new ParametersComparison(
          this.parameterExpected,
          this.getEquivalentForOptional(this.parameterActual),
          this.parsedExpectedFile,
          this.parsedActualFile,
        ).compare().length === 0
      ) {
        return [];
      }
    }

    if (
      this.parameterExpected.type instanceof DeclaredPropertyTypeUnionType &&
      this.parameterActual.type instanceof DeclaredPropertyTypeUnionType
    ) {
      const actualTypes = new Set<string>();
      this.parameterActual.type.value.forEach((v) => actualTypes.add(serialize(v)));

      const expectedTypes = new Set<string>();
      this.parameterExpected.type.value.forEach((v) => expectedTypes.add(serialize(v)));

      if (Array.from(actualTypes.values()).every((a) => expectedTypes.has(a))) {
        return this.parameterExpected.type.value.length === this.parameterActual.type.value.length
          ? []
          : [new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual)];
      }
    } else if (this.parameterExpected.type instanceof DeclaredPropertyTypeUnionType) {
      const actualTypes = this.getTypesAsArray(this.parameterActual.type);

      const expectedType = this.parameterExpected.type;

      const expectedTypeValues = expectedType.value.map((t) => {
        if (t instanceof DeclaredPropertyTypeLiterals) {
          return this.getEquivalentTypeForLiteral(t);
        }

        return t;
      });

      const expectedContainsActualType = actualTypes.some((actualType) => {
        return expectedTypeValues.some((typeOfUnion) => {
          return this.typesAreEqual(actualType, typeOfUnion);
        });
      });

      if (expectedContainsActualType === true) {
        return [new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual)];
      }
    }

    if (this.parameterExpected.optional === true) {
      if (
        this.typesAreEqual(this.parameterExpected.type, this.parameterActual.type) ||
        this.parameterActual.type.value === 'undefined'
      ) {
        return [new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual)];
      }
    }

    if (this.parameterExpected.type.value === 'any') {
      return [new ParameterTypeSolvableDifference(this.parameterExpected, this.parameterActual)];
    }

    if (this.parameterActual.type.value === 'any') {
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
          this.parsedExpectedFile,
          this.parsedActualFile,
        ).compare();
      }
    }

    if (this.parameterExpected.type instanceof DeclaredPropertyArrayType) {
      return new ParametersComparison(
        new DeclaredProperty(this.parameterExpected.name, this.parameterExpected.type.value),
        new DeclaredProperty(this.parameterActual.name, this.parameterActual.type.value),
        this.parsedExpectedFile,
        this.parsedActualFile,
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
}
