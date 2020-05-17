import DeclarationFileParser from '../src/parser/DeclarationFileParser';
import { DeclaredPropertyTypeInterface } from '../src/parser/model/declared-property-types/DeclaredPropertyTypeInterface';
import { DeclaredInterface } from '../src/parser/model/DeclaredInterface';
import { DeclaredProperty } from '../src/parser/model/DeclaredProperty';
import { DeclaredPropertyTypePrimitiveKeyword } from '../src/parser/model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';
import DATA_MODIFIERS from '../src/parser/model/data-modifiers';
import TAGS from '../src/parser/tags/tags';
import { DeclaredPropertyArrayType } from '../src/parser/model/declared-property-types/DeclaredPropertyArrayType';
import { DeclaredPropertyTypeIntersectionType } from '../src/parser/model/declared-property-types/DeclaredPropertyTypeIntersectionType';
import { DeclaredFunction } from '../src/parser/model/DeclaredFunction';
import { DeclaredPropertyTypeUnionType } from '../src/parser/model/declared-property-types/DeclaredPropertyTypeUnionType';
import { DeclaredPropertyTypeFunctionType } from '../src/parser/model/declared-property-types/DeclaredPropertyTypeFunctionType';
import DeclaredPropertyType from '../src/parser/model/declared-property-types/DeclaredPropertyType';

describe('Parser', () => {
	describe('interfaces', () => {
		it('return a PropertyTypeInterface for an interface declared as a literal', () => {
			const parsedFile = new DeclarationFileParser("tests/files/parser/interfaces/literal-interface.d.ts")
				.parse();

			expect(parsedFile.classes).toHaveLength(1);

			const expectedInterface = new DeclaredInterface("");
			expectedInterface.addProperty(
				new DeclaredProperty(
					"hello",
					new DeclaredPropertyTypePrimitiveKeyword("string"),
					false
				)
			);

			expectedInterface.addProperty(
				new DeclaredProperty(
					"world",
					new DeclaredPropertyTypePrimitiveKeyword("string"),
					false
				)
			)

			expect(parsedFile.classes[0].constructors[0].parameters[0].type).toEqual(
				new DeclaredPropertyTypeInterface(expectedInterface)
			);
		});
	
		it('should reference to the declared interface when the interface is not a literal', () => {
			const parsedFile = new DeclarationFileParser("tests/files/parser/interfaces/declared-interface.d.ts")
				.parse();

			expect(parsedFile.classes).toHaveLength(1);

			const expectedInterface = new DeclaredInterface("A");
			expectedInterface.addProperty(
				new DeclaredProperty(
					"hello",
					new DeclaredPropertyTypePrimitiveKeyword("string"),
					false
				)
			);

			expectedInterface.addProperty(
				new DeclaredProperty(
					"world",
					new DeclaredPropertyTypePrimitiveKeyword("string"),
					false
				)
			)

			expect(parsedFile.classes[0].constructors[0].parameters[0].type).toEqual(
				new DeclaredPropertyTypeInterface(expectedInterface)
			);

			expect(parsedFile.classes[0].constructors[0].parameters[0].type.value).toBe(
				parsedFile.namespaces.Greeter.interfaces[0]
			)
		});

		it('should detect data modifiers', () => {
			const parser = new DeclarationFileParser("tests/files/parser/interfaces/data-modifiers.d.ts")
			const parsedFile = parser.parse();

			expect(parsedFile.classes[0].properties).toContainEqual(
				new DeclaredProperty(
					"thisIsPrivate",
					new DeclaredPropertyTypePrimitiveKeyword("string"),
					false
				).addModifier(DATA_MODIFIERS.PRIVATE)
			);

			expect(parser.tags).toContainEqual(TAGS.PRIVATE);

			expect(parsedFile.classes[0].properties).toContainEqual(
				new DeclaredProperty(
					"thisIsProtected",
					new DeclaredPropertyTypePrimitiveKeyword("number"),
					false
				).addModifier(DATA_MODIFIERS.PROTECTED)
			);

			expect(parser.tags).toContainEqual(TAGS.PROTECTED);

			expect(parsedFile.classes[0].properties).toContainEqual(
				new DeclaredProperty(
					"THIS_IS_STATIC",
					new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword("boolean")),
					false
				).addModifier(DATA_MODIFIERS.STATIC)
			);

			expect(parser.tags).toContainEqual(TAGS.STATIC);

			expect(parsedFile.classes[0].properties).toContainEqual(
				new DeclaredProperty(
					"thisIsReadOnly",
					new DeclaredPropertyTypePrimitiveKeyword("boolean"),
					false
				).addModifier(DATA_MODIFIERS.READONLY)
			);

			expect(parser.tags).toContainEqual(TAGS.READONLY);

			expect(parsedFile.classes[0].properties).toContainEqual(
				new DeclaredProperty(
					"thisIsPublic",
					new DeclaredPropertyTypePrimitiveKeyword("string"),
					false
				).addModifier(DATA_MODIFIERS.PUBLIC)
			);

			expect(parser.tags).toContainEqual(TAGS.PUBLIC);
		});

		it('should detect dot-dot-dot token', () => {
			const parser = new DeclarationFileParser("tests/files/parser/interfaces/dot-dot-dot-token.d.ts")
			const parsedFile = parser.parse();

			expect(parsedFile.functions[0].parameters).toContainEqual(
				new DeclaredProperty(
					"restOfName",
					new DeclaredPropertyArrayType(new DeclaredPropertyTypePrimitiveKeyword("string")),
					false
				).setDotDotDotToken(true)
			);

			expect(parser.tags).toContainEqual(TAGS.DOT_DOT_DOT_TOKEN);
		});

		it('should detect the intersection type', () => {
			const parser = new DeclarationFileParser("tests/files/parser/interfaces/intersection-type.d.ts")
			const parsedFile = parser.parse();

			expect(parsedFile.functions[0].returnType).toEqual(
				new DeclaredPropertyTypeIntersectionType([
					new DeclaredPropertyTypePrimitiveKeyword("string"),
					new DeclaredPropertyTypePrimitiveKeyword("number")
				])
			);

			expect(parser.tags).toContainEqual(TAGS.INTERSECTION);
		});

		it('should detect call signatures', () => {
			const parser = new DeclarationFileParser("tests/files/parser/interfaces/call-signature.d.ts")
			const parsedFile = parser.parse();

			expect(parsedFile.interfaces[0].callSignatures[0]).toEqual(
				new DeclaredFunction("", new DeclaredPropertyTypePrimitiveKeyword("number"))
					.addParameter(new DeclaredProperty("a", new DeclaredPropertyTypePrimitiveKeyword("string")))
			);

			expect(parser.tags).toContainEqual(TAGS.CALL_SIGNATURE);
		});

		it('should detect type aliases', () => {
			const parser = new DeclarationFileParser("tests/files/parser/interfaces/type-alias.d.ts")
			const parsedFile = parser.parse();

			expect(parsedFile.functions[0].parameters[0]).toEqual(
				new DeclaredProperty("a",
					new DeclaredPropertyTypeUnionType(
						[new DeclaredPropertyTypePrimitiveKeyword("string"), new DeclaredPropertyTypePrimitiveKeyword("number")]
					)
				)
			);

			let circularType = {} as DeclaredPropertyType;
			const anotherType = new DeclaredPropertyTypeFunctionType(new DeclaredFunction("", circularType));

			Object.assign(circularType, new DeclaredPropertyTypeUnionType(
				[new DeclaredPropertyTypePrimitiveKeyword("string"), anotherType]
			));

			expect(parsedFile.functions[0].parameters[1].type).toEqual(circularType);

			expect(parser.tags).toContainEqual(TAGS.ALIAS);
		});
	});
});