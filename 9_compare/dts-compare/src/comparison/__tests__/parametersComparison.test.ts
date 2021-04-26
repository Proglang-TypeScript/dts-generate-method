import DeclarationFileParser from '../../parser/DeclarationFileParser';
import ParameterTypeSolvableDifference from '../../difference/ParameterTypeSolvableDifference';
import Comparator from '../../Comparator';
import { DeclaredPropertyTypeUnionType } from '../../parser/model/declared-property-types/DeclaredPropertyTypeUnionType';
import { DeclaredProperty } from '../../parser/model/DeclaredProperty';
import { DeclaredPropertyTypePrimitiveKeyword } from '../../parser/model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';
import { DeclaredFunction } from '../../parser/model/DeclaredFunction';
import { DeclaredPropertyTypeFunctionType } from '../../parser/model/declared-property-types/DeclaredPropertyTypeFunctionType';
import { DeclaredPropertyTypeReferenceType } from '../../parser/model/declared-property-types/DeclaredPropertyTypeReferenceType';
import { DeclaredPropertyTypeAnyKeyword } from '../../parser/model/declared-property-types/DeclaredPropertyTypeAnyKeyword';
import { DeclaredPropertyArrayType } from '../../parser/model/declared-property-types/DeclaredPropertyArrayType';
import ParameterTypeUnsolvableDifference from '../../difference/ParameterTypeUnsolvableDifference';
import { DeclaredPropertyTypeUndefinedKeyword } from '../../parser/model/declared-property-types/DeclaredPropertyTypeUndefinedKeyword';

describe('Parameters comparison', () => {
  describe('callback parameters', () => {
    it('should detect differences in the parameters of callback parameters', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/callback-parameters/callback-parameter-with-union.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/callback-parameters/callback-parameter.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedClassExpected, parsedClassActual).differences;
      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty(
            'a',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyTypePrimitiveKeyword('string'),
              new DeclaredPropertyTypePrimitiveKeyword('number'),
            ]),
            false,
          ),
          new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
        ),
      );
    });

    it('should consider a solvable difference if the actual file has the `Function` type', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/callback-parameters/callback-parameter-with-union.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/callback-parameters/callback-parameter-Function-type.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedClassExpected, parsedClassActual).differences;

      const cbFunction = new DeclaredFunction(
        '',
        new DeclaredPropertyTypePrimitiveKeyword('number'),
      );
      cbFunction.addParameter(
        new DeclaredProperty(
          'a',
          new DeclaredPropertyTypeUnionType([
            new DeclaredPropertyTypePrimitiveKeyword('string'),
            new DeclaredPropertyTypePrimitiveKeyword('number'),
          ]),
        ),
      );

      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty('cb', new DeclaredPropertyTypeFunctionType(cbFunction), false),
          new DeclaredProperty('cb', new DeclaredPropertyTypeReferenceType('Function'), false),
        ),
      );
    });

    it('should detect differences in the parameters of callback parameters on multiple levels of recursion', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/callback-parameters/callback-parameter-in-callback-parameter-with-union.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/callback-parameters/callback-parameter-in-callback-parameter.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedClassExpected, parsedClassActual).differences;
      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty(
            'a2',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyTypePrimitiveKeyword('string'),
              new DeclaredPropertyTypePrimitiveKeyword('number'),
            ]),
            false,
          ),
          new DeclaredProperty('a2', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
        ),
      );
    });
  });

  describe('arrays', () => {
    it('should detect differences in the array types ', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/arrays/array-simple-with-union.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/arrays/array-simple.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedClassExpected, parsedClassActual).differences;
      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty(
            'a',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyTypePrimitiveKeyword('string'),
              new DeclaredPropertyTypePrimitiveKeyword('number'),
            ]),
            false,
          ),
          new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
        ),
      );
    });

    it('should detect differences in the array types on multiple levels of recursion', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/callback-parameters/callback-parameter-in-callback-parameter-with-union.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/callback-parameters/callback-parameter-in-callback-parameter.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedClassExpected, parsedClassActual).differences;
      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty(
            'a2',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyTypePrimitiveKeyword('string'),
              new DeclaredPropertyTypePrimitiveKeyword('number'),
            ]),
            false,
          ),
          new DeclaredProperty('a2', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
        ),
      );
    });
  });

  describe('any', () => {
    it('should consider an `any` in the actual file as a `solvable` difference', () => {
      const parsedFileExpected = new DeclarationFileParser(
        `${__dirname}/files/any/any-in-actual.expected.d.ts`,
      ).parse();
      const parsedFileActual = new DeclarationFileParser(
        `${__dirname}/files/any/any-in-actual.actual.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedFileExpected, parsedFileActual).differences;
      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
          new DeclaredProperty('a', new DeclaredPropertyTypeAnyKeyword(), false),
        ),
      );
    });
  });

  describe('optional parameters', () => {
    it('should treat an optional parameter with a type and the union of that type and `undefined` as equivalent', () => {
      let parsedExpected = new DeclarationFileParser(
        `${__dirname}/files/undefined/undefined-equivalent.expected.d.ts`,
      ).parse();
      let parsedActual = new DeclarationFileParser(
        `${__dirname}/files/undefined/undefined-equivalent.actual.d.ts`,
      ).parse();

      expect(new Comparator().compare(parsedExpected, parsedActual).differences).toHaveLength(0);

      parsedActual = new DeclarationFileParser(
        `${__dirname}/files/undefined/undefined-equivalent.expected.d.ts`,
      ).parse();
      parsedExpected = new DeclarationFileParser(
        `${__dirname}/files/undefined/undefined-equivalent.actual.d.ts`,
      ).parse();

      expect(new Comparator().compare(parsedActual, parsedExpected).differences).toHaveLength(0);
    });

    it('should return a solvable difference if the actual optional type is `undefined`', () => {
      const parsedExpected = new DeclarationFileParser(
        `${__dirname}/files/undefined/undefined.expected.d.ts`,
      ).parse();
      const parsedActual = new DeclarationFileParser(
        `${__dirname}/files/undefined/undefined.actual.d.ts`,
      ).parse();

      const differences = new Comparator().compare(parsedExpected, parsedActual).differences;
      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty('c', new DeclaredPropertyTypePrimitiveKeyword('number'), true),
          new DeclaredProperty('c', new DeclaredPropertyTypeUndefinedKeyword(), true),
        ),
      );
    });
  });

  describe('union', () => {
    it('should not consider the order of the elements in the union', () => {
      const parsedExpected = new DeclarationFileParser(
        `${__dirname}/files/type-union/type-union-different-order.expected.d.ts`,
      ).parse();
      const parsedActual = new DeclarationFileParser(
        `${__dirname}/files/type-union/type-union-different-order.actual.d.ts`,
      ).parse();

      const comparator = new Comparator();
      expect(comparator.compare(parsedExpected, parsedActual).differences).toHaveLength(0);
      expect(comparator.compare(parsedActual, parsedExpected).differences).toHaveLength(0);
    });

    it('should treat missing expected union values as solvable', () => {
      const parsedExpected = new DeclarationFileParser(
        `${__dirname}/files/type-union/type-union-missing-values.expected.d.ts`,
      ).parse();
      const parsedActual = new DeclarationFileParser(
        `${__dirname}/files/type-union/type-union-missing-values.actual.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedExpected, parsedActual).differences;
      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty(
            'a',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyTypePrimitiveKeyword('string'),
              new DeclaredPropertyTypePrimitiveKeyword('number'),
            ]),
          ),
          new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string')),
        ),
      );

      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty(
            'b',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('number')),
              new DeclaredPropertyTypePrimitiveKeyword('string'),
            ]),
          ),
          new DeclaredProperty('b', new DeclaredPropertyTypePrimitiveKeyword('string')),
        ),
      );

      expect(differences).toContainEqual(
        new ParameterTypeSolvableDifference(
          new DeclaredProperty(
            'c',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyTypePrimitiveKeyword('string'),
              new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
              new DeclaredPropertyArrayType(
                new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
              ),
            ]),
          ),
          new DeclaredProperty(
            'c',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyArrayType(
                new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
              ),
              new DeclaredPropertyTypePrimitiveKeyword('string'),
            ]),
          ),
        ),
      );
    });

    it('should treat extra union values (not in expected) as unsolvable', () => {
      const parsedExpected = new DeclarationFileParser(
        `${__dirname}/files/type-union/type-union-missing-values.actual.d.ts`,
      ).parse();

      const parsedActual = new DeclarationFileParser(
        `${__dirname}/files/type-union/type-union-missing-values.expected.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedExpected, parsedActual).differences;
      expect(differences).toContainEqual(
        new ParameterTypeUnsolvableDifference(
          new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string')),
          new DeclaredProperty(
            'a',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyTypePrimitiveKeyword('string'),
              new DeclaredPropertyTypePrimitiveKeyword('number'),
            ]),
          ),
        ),
      );

      expect(differences).toContainEqual(
        new ParameterTypeUnsolvableDifference(
          new DeclaredProperty('b', new DeclaredPropertyTypePrimitiveKeyword('string')),
          new DeclaredProperty(
            'b',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('number')),
              new DeclaredPropertyTypePrimitiveKeyword('string'),
            ]),
          ),
        ),
      );

      expect(differences).toContainEqual(
        new ParameterTypeUnsolvableDifference(
          new DeclaredProperty(
            'c',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyArrayType(
                new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
              ),
              new DeclaredPropertyTypePrimitiveKeyword('string'),
            ]),
          ),
          new DeclaredProperty(
            'c',
            new DeclaredPropertyTypeUnionType([
              new DeclaredPropertyTypePrimitiveKeyword('string'),
              new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
              new DeclaredPropertyArrayType(
                new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
              ),
            ]),
          ),
        ),
      );
    });
  });
});
