import DeclarationFileParser from '../DeclarationFileParser';
import { DeclaredPropertyTypeInterface } from '../model/declared-property-types/DeclaredPropertyTypeInterface';
import { DeclaredInterface } from '../model/DeclaredInterface';
import { DeclaredProperty } from '../model/DeclaredProperty';
import { DeclaredPropertyTypePrimitiveKeyword } from '../model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';
import DATA_MODIFIERS from '../model/data-modifiers';
import TAGS from '../tags/tags';
import { DeclaredPropertyArrayType } from '../model/declared-property-types/DeclaredPropertyArrayType';
import { DeclaredPropertyTypeIntersectionType } from '../model/declared-property-types/DeclaredPropertyTypeIntersectionType';
import { DeclaredFunction } from '../model/DeclaredFunction';
import { DeclaredPropertyTypeUnionType } from '../model/declared-property-types/DeclaredPropertyTypeUnionType';
import { DeclaredPropertyTypeObjectKeyword } from '../model/declared-property-types/DeclaredPropertyTypeObjectKeyword';
import { DeclaredPropertyTypeVoidKeyword } from '../model/declared-property-types/DeclaredPropertyTypeVoidKeyword';
import { DeclaredPropertyTypeReferenceType } from '../model/declared-property-types/DeclaredPropertyTypeReferenceType';

describe('Parser', () => {
  describe('interfaces', () => {
    it('return a PropertyTypeInterface for an interface declared as a literal', () => {
      const parsedFile = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/literal-interface.d.ts`,
      ).parse();

      expect(parsedFile.classes).toHaveLength(1);

      const expectedInterface = new DeclaredInterface('');
      expectedInterface.addProperty(
        new DeclaredProperty('hello', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
      );

      expectedInterface.addProperty(
        new DeclaredProperty('world', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
      );

      expect(parsedFile.classes[0].constructors[0].parameters[0].type).toEqual(
        new DeclaredPropertyTypeInterface(expectedInterface),
      );
    });

    it('should reference to the declared interface when the interface is not a literal', () => {
      const parsedFile = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/declared-interface.d.ts`,
      ).parse();

      expect(parsedFile.classes).toHaveLength(1);

      const expectedInterface = new DeclaredInterface('A');
      expectedInterface.addProperty(
        new DeclaredProperty('hello', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
      );

      expectedInterface.addProperty(
        new DeclaredProperty('world', new DeclaredPropertyTypePrimitiveKeyword('string'), false),
      );

      expect(parsedFile.classes[0].constructors[0].parameters[0].type).toEqual(
        new DeclaredPropertyTypeInterface(expectedInterface),
      );

      expect(parsedFile.classes[0].constructors[0].parameters[0].type.value).toBe(
        parsedFile.namespaces.Greeter.interfaces[0],
      );
    });

    it('should detect call signatures', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/call-signature.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.interfaces[0].callSignatures[0]).toEqual(
        new DeclaredFunction('', new DeclaredPropertyTypePrimitiveKeyword('number')).addParameter(
          new DeclaredProperty('a', new DeclaredPropertyTypePrimitiveKeyword('string')),
        ),
      );

      expect(parser.tags.has(TAGS.CALL_SIGNATURE)).toBe(true);
    });

    it('should handle circular references', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/circular-reference.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.namespaces.Greeter.interfaces[0].properties[0].type.value).toBe(
        parsedFile.namespaces.Greeter.interfaces[0],
      );
    });
  });

  describe('data modifiers', () => {
    it('should detect data modifiers', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/data-modifiers.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.classes[0].properties).toContainEqual(
        new DeclaredProperty(
          'thisIsPrivate',
          new DeclaredPropertyTypePrimitiveKeyword('string'),
          false,
        ).addModifier(DATA_MODIFIERS.PRIVATE),
      );

      expect(parser.tags.has(TAGS.PRIVATE)).toBe(true);

      expect(parsedFile.classes[0].properties).toContainEqual(
        new DeclaredProperty(
          'thisIsProtected',
          new DeclaredPropertyTypePrimitiveKeyword('number'),
          false,
        ).addModifier(DATA_MODIFIERS.PROTECTED),
      );

      expect(parser.tags.has(TAGS.PROTECTED)).toBe(true);

      expect(parsedFile.classes[0].properties).toContainEqual(
        new DeclaredProperty(
          'THIS_IS_STATIC',
          new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('boolean')),
          false,
        ).addModifier(DATA_MODIFIERS.STATIC),
      );

      expect(parser.tags.has(TAGS.STATIC)).toBe(true);

      expect(parsedFile.classes[0].properties).toContainEqual(
        new DeclaredProperty(
          'thisIsReadOnly',
          new DeclaredPropertyTypePrimitiveKeyword('boolean'),
          false,
        ).addModifier(DATA_MODIFIERS.READONLY),
      );

      expect(parser.tags.has(TAGS.READONLY)).toBe(true);

      expect(parsedFile.classes[0].properties).toContainEqual(
        new DeclaredProperty(
          'thisIsPublic',
          new DeclaredPropertyTypePrimitiveKeyword('string'),
          false,
        ).addModifier(DATA_MODIFIERS.PUBLIC),
      );

      expect(parser.tags.has(TAGS.PUBLIC)).toBe(true);
    });
  });

  describe('dot-dot-dot token', () => {
    it('should detect dot-dot-dot token', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/dot-dot-dot-token.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].parameters).toContainEqual(
        new DeclaredProperty(
          'restOfName',
          new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
          false,
        ).setDotDotDotToken(true),
      );

      expect(parser.tags.has(TAGS.DOT_DOT_DOT_TOKEN)).toBe(true);
    });
  });

  describe('typescript types', () => {
    it('should detect the intersection type', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/intersection-type.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].returnType).toEqual(
        new DeclaredPropertyTypeIntersectionType([
          new DeclaredPropertyTypePrimitiveKeyword('string'),
          new DeclaredPropertyTypePrimitiveKeyword('number'),
        ]),
      );

      expect(parser.tags.has(TAGS.INTERSECTION)).toBe(true);
    });

    it('should detect type aliases', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/type-alias.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].parameters[0]).toEqual(
        new DeclaredProperty(
          'a',
          new DeclaredPropertyTypeUnionType([
            new DeclaredPropertyTypePrimitiveKeyword('string'),
            new DeclaredPropertyTypePrimitiveKeyword('number'),
          ]),
        ),
      );

      expect(parsedFile.functions[0].parameters[1].type).toBe(
        parsedFile.functions[0].parameters[1].type.value[1].value.returnType,
      );

      expect(parser.tags.has(TAGS.ALIAS)).toBe(true);
    });

    it('should detect the union type', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/union-type.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].parameters[0].type).toEqual(
        new DeclaredPropertyTypeUnionType([
          new DeclaredPropertyTypePrimitiveKeyword('string'),
          new DeclaredPropertyTypePrimitiveKeyword('number'),
        ]),
      );

      expect(parser.tags.has(TAGS.UNION)).toBe(true);
    });

    it('should detect the object keyword', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/object-keyword.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].parameters[0].type).toEqual(
        new DeclaredPropertyTypeObjectKeyword(),
      );

      expect(parser.tags.has(TAGS.OBJECT)).toBe(true);
    });

    it('should detect the void keyword', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/void-keyword.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].returnType).toEqual(new DeclaredPropertyTypeVoidKeyword());

      expect(parser.tags.has(TAGS.VOID)).toBe(true);
    });

    it('should detect the string keyword', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/string-keyword.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].parameters[0].type).toEqual(
        new DeclaredPropertyTypePrimitiveKeyword('string'),
      );

      expect(parser.tags.has(TAGS.STRING)).toBe(true);
    });

    it('should detect the number keyword', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/number-keyword.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].parameters[0].type).toEqual(
        new DeclaredPropertyTypePrimitiveKeyword('number'),
      );

      expect(parser.tags.has(TAGS.NUMBER)).toBe(true);
    });

    it('should detect the boolean keyword', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/boolean-keyword.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].parameters[0].type).toEqual(
        new DeclaredPropertyTypePrimitiveKeyword('boolean'),
      );

      expect(parser.tags.has(TAGS.BOOLEAN)).toBe(true);
    });

    it('should detect the "Function" keyword', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/function-keyword.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].parameters[0].type).toEqual(
        new DeclaredPropertyTypeReferenceType('Function'),
      );

      expect(parser.tags.has(TAGS.TYPE_REFERENCE_FUNCTION)).toBe(true);
      expect(parser.tags.has(TAGS.FUNCTION)).toBe(true);
    });

    it('should detect "Readonly" arrays', () => {
      const parser = new DeclarationFileParser(
        `${__dirname}/files/parser/interfaces/readonly-array.d.ts`,
      );
      const parsedFile = parser.parse();

      expect(parsedFile.functions[0].parameters[0].type).toEqual(
        new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword('string')),
      );

      expect(parser.tags.has(TAGS.ARRAY)).toBe(true);
      expect(parser.tags.has(TAGS.READONLY_ARRAY)).toBe(true);
    });
  });
});
