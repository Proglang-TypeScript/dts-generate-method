import DeclarationFileParser from '../src/parser/DeclarationFileParser';
import { DeclaredPropertyTypeInterface } from '../src/parser/model/declared-property-types/DeclaredPropertyTypeInterface';
import { DeclaredInterface } from '../src/parser/model/DeclaredInterface';
import { DeclaredProperty } from '../src/parser/model/DeclaredProperty';
import { DeclaredPropertyTypePrimitiveKeyword } from '../src/parser/model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';

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
	});
});