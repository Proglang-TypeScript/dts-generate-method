import DeclarationFileParser from '../src/parser/DeclarationFileParser';
import { DeclaredPropertyTypeInterface } from '../src/parser/model/declared-property-types/DeclaredPropertyTypeInterface';
import { DeclaredInterface } from '../src/parser/model/DeclaredInterface';
import { DeclaredProperty } from '../src/parser/model/DeclaredProperty';
import { DeclaredPropertyTypePrimitiveKeyword } from '../src/parser/model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';
import DATA_MODIFIERS from '../src/parser/model/data-modifiers';
import TAGS from '../src/parser/tags/tags';
import { DeclaredPropertyArrayType } from '../src/parser/model/declared-property-types/DeclaredPropertyArrayType';

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
		});
	});
});