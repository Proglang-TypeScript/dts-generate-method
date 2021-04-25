import Comparator from '../Comparator';
import ParameterTypeUnsolvableDifference from '../difference/ParameterTypeUnsolvableDifference';
import ParameterMissingDifference from '../difference/ParameterMissingDifference';
import ParameterExtraDifference from '../difference/ParameterExtraDifference';

import DeclarationFileParser from '../parser/DeclarationFileParser';
import { DeclaredProperty } from '../parser/model/DeclaredProperty';
import { DeclaredPropertyTypePrimitiveKeyword } from '../parser/model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';
import ParameterTypeSolvableDifference from '../difference/ParameterTypeSolvableDifference';
import TemplateDifference from '../difference/TemplateDifference';
import FunctionMissingDifference from '../difference/FunctionMissingDifference';
import FunctionExtraDifference from '../difference/FunctionExtraDifference';
import { DeclaredPropertyTypeUnionType } from '../parser/model/declared-property-types/DeclaredPropertyTypeUnionType';
import { DeclaredPropertyTypeLiterals } from '../parser/model/declared-property-types/DeclaredPropertyTypeLiterals';
import { DeclaredFunction } from '../parser/model/DeclaredFunction';
import { DeclaredPropertyTypeAnyKeyword } from '../parser/model/declared-property-types/DeclaredPropertyTypeAnyKeyword';
import { DeclaredPropertyTypeUndefinedKeyword } from '../parser/model/declared-property-types/DeclaredPropertyTypeUndefinedKeyword';
import { DeclaredPropertyArrayType } from '../parser/model/declared-property-types/DeclaredPropertyArrayType';
import { DeclaredPropertyTypeVoidKeyword } from '../parser/model/declared-property-types/DeclaredPropertyTypeVoidKeyword';

describe('Comparator', () => {
  describe('templates', () => {
    it('should return one difference for different modules', () => {
      const parsedExpectedFile = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/constructor/parameters/one-class.d.ts`,
      ).parse();
      const parsedActualFile = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-function/myfunction.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const comparison = comparator.compare(parsedExpectedFile, parsedActualFile).differences;

      expect(comparison).toHaveLength(1);
      expect(comparison).toContainEqual(new TemplateDifference('module-class', 'module-function'));
    });

    it('should return no differences for same class', () => {
      const declarationFile = `${__dirname}/files/comparator-module-class/one-class.d.ts`;

      const comparator = new Comparator();
      expect(
        comparator.compare(
          new DeclarationFileParser(declarationFile).parse(),
          new DeclarationFileParser(declarationFile).parse(),
        ).differences,
      ).toHaveLength(0);
    });
  });

  describe('methods', () => {
    describe('parameters', () => {
      it('should detect different types for the same parameter in the constructor', () => {
        const parsedClassExpected = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/constructor/parameters/one-class.d.ts`,
        ).parse();
        const parsedClassActual = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/constructor/parameters/one-class-with-only-one-different-constructor-parameter-type.d.ts`,
        ).parse();

        const comparator = new Comparator();
        expect(
          comparator.compare(parsedClassExpected, parsedClassActual).differences,
        ).toContainEqual(
          new ParameterTypeUnsolvableDifference(
            new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('number'), false),
            new DeclaredProperty('a1', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
          ),
        );
      });

      it('should detect different types for the same parameter', () => {
        const parsedClassExpected = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method.d.ts`,
        ).parse();
        const parsedClassActual = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-different-parameter.d.ts`,
        ).parse();

        const comparator = new Comparator();
        expect(
          comparator.compare(parsedClassExpected, parsedClassActual).differences,
        ).toContainEqual(
          new ParameterTypeUnsolvableDifference(
            new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
            new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('number'), false),
          ),
        );
      });

      it('should detect different types for the same parameter as a empty intersection', () => {
        const parsedClassExpected = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-union-type.d.ts`,
        ).parse();
        const parsedClassActual = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-different-type-union-empty-intersection.d.ts`,
        ).parse();

        const comparator = new Comparator();
        expect(
          comparator.compare(parsedClassExpected, parsedClassActual).differences,
        ).toContainEqual(
          new ParameterTypeUnsolvableDifference(
            new DeclaredProperty(
              'a',
              new DeclaredPropertyTypeUnionType([
                new DeclaredPropertyTypePrimitiveKeyword('string'),
                new DeclaredPropertyTypePrimitiveKeyword('number'),
              ]),
              false,
            ),
            new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('boolean'), false),
          ),
        );
      });

      it('should detect different types for the same parameter as a non empty intersection', () => {
        const parsedClassExpected = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-union-type.d.ts`,
        ).parse();
        const parsedClassActual = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-different-type-union.d.ts`,
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

        expect(differences).toContainEqual(
          new ParameterTypeSolvableDifference(
            new DeclaredProperty(
              'a',
              new DeclaredPropertyTypeUnionType([
                new DeclaredPropertyTypePrimitiveKeyword('string'),
                new DeclaredPropertyTypePrimitiveKeyword('number'),
                new DeclaredPropertyTypePrimitiveKeyword('boolean'),
              ]),
              false,
            ),
            new DeclaredProperty(
              'a',
              new DeclaredPropertyTypeUnionType([
                new DeclaredPropertyTypePrimitiveKeyword('string'),
                new DeclaredPropertyTypePrimitiveKeyword('boolean'),
              ]),
              false,
            ),
          ),
        );

        expect(differences).toContainEqual(
          new ParameterTypeSolvableDifference(
            new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string'), true),
            new DeclaredProperty('a', new DeclaredPropertyTypeUndefinedKeyword(), false),
          ),
        );

        expect(differences).toContainEqual(
          new ParameterTypeSolvableDifference(
            new DeclaredProperty('b', new DeclaredPropertyTypeAnyKeyword(), false),
            new DeclaredProperty('b', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
          ),
        );

        expect(differences).toContainEqual(
          new ParameterTypeSolvableDifference(
            new DeclaredProperty('c', new DeclaredPropertyTypeLiterals(`'hello'`), false),
            new DeclaredProperty('c', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
          ),
        );

        expect(differences).toContainEqual(
          new ParameterTypeSolvableDifference(
            new DeclaredProperty(
              'd',
              new DeclaredPropertyTypeUnionType([
                new DeclaredPropertyTypeLiterals('1'),
                new DeclaredPropertyTypeLiterals('2'),
                new DeclaredPropertyTypeLiterals('3'),
                new DeclaredPropertyTypeLiterals('4'),
                new DeclaredPropertyTypeLiterals('5'),
              ]),
              false,
            ),
            new DeclaredProperty('d', new DeclaredPropertyTypePrimitiveKeyword('number'), false),
          ),
        );
      });

      it('should detect differences in optional flag as non empty intersection', () => {
        const parsedClassExpected = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-optional-parameter.d.ts`,
        ).parse();
        const parsedClassActual = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-optional-parameter-not-marked-as-optional.d.ts`,
        ).parse();

        const comparator = new Comparator();
        const differences = comparator.compare(parsedClassExpected, parsedClassActual).differences;
        expect(differences).toContainEqual(
          new ParameterTypeSolvableDifference(
            new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string'), true),
            new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
          ),
        );
      });

      it('should ignore differences in the name for the same parameter', () => {
        const parsedClassExpected = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method.d.ts`,
        ).parse();
        const parsedClassActual = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-same-parameter-different-name.d.ts`,
        ).parse();

        const comparator = new Comparator();
        expect(comparator.compare(parsedClassExpected, parsedClassActual).differences).toHaveLength(
          0,
        );
      });

      it('should detect missing parameters', () => {
        const parsedClassExpected = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method.d.ts`,
        ).parse();
        const parsedClassActual = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-missing-parameter.d.ts`,
        ).parse();

        const comparator = new Comparator();
        const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
        expect(result).toContainEqual(
          new ParameterMissingDifference(
            new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
          ),
        );
      });

      it('should detect extra parameters', () => {
        const parsedClassExpected = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method.d.ts`,
        ).parse();
        const parsedClassActual = new DeclarationFileParser(
          `${__dirname}/files/comparator-module-class/method/parameters/one-class-one-method-extra-parameter.d.ts`,
        ).parse();

        const comparator = new Comparator();
        const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
        expect(result).toContainEqual(
          new ParameterExtraDifference(
            new DeclaredProperty('b', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
          ),
        );
      });
    });

    it('should detect missing methods', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/method/one-class.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/method/one-class-without-method.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedClassExpected, parsedClassActual).differences;

      const missingFunction = new DeclaredFunction(
        'myMethod',
        new DeclaredPropertyTypeVoidKeyword(),
      ).addParameter(
        new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('number'), false),
      );

      expect(differences).toContainEqual(new FunctionMissingDifference(missingFunction));
    });

    it('should detect extra methods', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/method/one-class.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/method/one-class-with-extra-method.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const differences = comparator.compare(parsedClassExpected, parsedClassActual).differences;

      const extraFunction = new DeclaredFunction(
        'myExtraMethod',
        new DeclaredPropertyTypeVoidKeyword(),
      );

      expect(differences).toContainEqual(new FunctionExtraDifference(extraFunction));
    });
  });

  describe('interfaces', () => {
    it('should detect differences in the types of the common properties', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class-with-different-constructor-parameter-type.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
      expect(result).toContainEqual(
        new ParameterTypeUnsolvableDifference(
          new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
          new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('number'), false),
        ),
      );

      expect(result).toContainEqual(
        new ParameterTypeUnsolvableDifference(
          new DeclaredProperty('c', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
          new DeclaredProperty('c', new DeclaredPropertyTypePrimitiveKeyword('number'), false),
        ),
      );
    });

    it('should detect missing properties of the interface', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class-missing-properties.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
      expect(result).toContainEqual(
        new ParameterMissingDifference(
          new DeclaredProperty('b', new DeclaredPropertyTypePrimitiveKeyword('number'), false),
        ),
      );

      expect(result).toContainEqual(
        new ParameterMissingDifference(
          new DeclaredProperty(
            'c',
            new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
            false,
          ),
        ),
      );
    });

    it('should detect extra properties', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class-extra-properties.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
      expect(result).toContainEqual(
        new ParameterExtraDifference(
          new DeclaredProperty(
            'something',
            new DeclaredPropertyTypePrimitiveKeyword('number'),
            false,
          ),
        ),
      );

      expect(result).toContainEqual(
        new ParameterExtraDifference(
          new DeclaredProperty(
            'anotherThing',
            new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
            false,
          ),
        ),
      );
    });

    it('should detect be able to handle recursively nested Interfaces', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class-nested-interfaces.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
      expect(result).toContainEqual(
        new ParameterTypeUnsolvableDifference(
          new DeclaredProperty('b', new DeclaredPropertyTypePrimitiveKeyword('number'), false),
          new DeclaredProperty('b', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
        ),
      );
    });

    it('should ignore differences in the names of the same Interface', () => {
      const parsedClassExpected = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class.d.ts`,
      ).parse();
      const parsedClassActual = new DeclarationFileParser(
        `${__dirname}/files/comparator-module-class/interfaces/one-class-different-interface-name.d.ts`,
      ).parse();

      const comparator = new Comparator();
      const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
      expect(result).toHaveLength(0);
    });
  });
});
