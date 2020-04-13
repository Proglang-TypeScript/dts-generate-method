import Comparator from '../src/Comparator';
import ParameterTypeEmptyIntersectionDifference from '../src/difference/ParameterTypeEmptyIntersectionDifference';
import ParameterMissingDifference from '../src/difference/ParameterMissingDifference';
import ParameterExtraDifference from '../src/difference/ParameterExtraDifference';

import DeclarationFileParser from '../src/parser/DeclarationFileParser';
import { DeclaredProperty } from '../src/parser/model/DeclaredProperty';
import { DeclaredPropertyTypePrimitiveKeyword } from '../src/parser/model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';
import ParameterTypeNonEmptyIntersectionDifference from '../src/difference/ParameterTypeNonEmptyIntersectionDifference';
import TemplateDifference from '../src/difference/TemplateDifference';
import { DeclaredPropertyTypeUnionType } from '../src/parser/model/declared-property-types/DeclaredPropertyTypeUnionType';

describe('Comparator', () => {
	describe('templates', () => {
		it('should return one difference for different modules', () => {
			let parsedExpectedFile = new DeclarationFileParser("tests/files/comparator-module-class/constructor/parameters/one-class.d.ts").parse();
			let parsedActualFile = new DeclarationFileParser("tests/files/comparator-module-function/myfunction.d.ts").parse();

			const comparator = new Comparator();
			const comparison = comparator.compare(
				parsedExpectedFile,
				parsedActualFile
			).differences;

			expect(comparison).toHaveLength(1);
			expect(comparison).toContainEqual(
				new TemplateDifference("module-class", "module-function")
			);
		});

		it('should return no differences for same class', () => {
			const declarationFile = "tests/files/comparator-module-class/one-class.d.ts";

			const comparator = new Comparator();
			expect(comparator.compare(
				new DeclarationFileParser(declarationFile).parse(),
				new DeclarationFileParser(declarationFile).parse()
			).differences).toHaveLength(0);
		});
	});

	describe('methods', () => {
		describe('parameters', () => {
			it('should detect different types for the same parameter in the constructor', () => {
				let parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/constructor/parameters/one-class.d.ts").parse();
				let parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/constructor/parameters/one-class-with-only-one-different-constructor-parameter-type.d.ts").parse();

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual).differences)
					.toContainEqual(new ParameterTypeEmptyIntersectionDifference(
						{
							name: "a",
							type: {
								kind: "primitive_keyword",
								value: "number"
							},
							optional: false
						},
						{
							name: "a1",
							type: {
								kind: "primitive_keyword",
								value: "string"
							},
							optional: false
						}
					));
			});

			it('should detect different types for the same parameter', () => {
				let parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method.d.ts").parse();
				let parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method-different-parameter.d.ts").parse();

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual).differences)
					.toContainEqual(new ParameterTypeEmptyIntersectionDifference(
						{
							name: "a",
							type: {
								kind: "primitive_keyword",
								value: "string"
							},
							optional: false
						},
						{
							name: "a",
							type: {
								kind: "primitive_keyword",
								value: "number"
							},
							optional: false
						}
					));
			});

			it('should detect different types for the same parameter as a empty intersection', () => {
				let parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method-union-type.d.ts").parse();
				let parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method-different-type-union-empty-intersection.d.ts").parse();
				
				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual).differences)
					.toContainEqual(new ParameterTypeEmptyIntersectionDifference(
						new DeclaredProperty(
							"a",
							new DeclaredPropertyTypeUnionType([
								new DeclaredPropertyTypePrimitiveKeyword("string"),
								new DeclaredPropertyTypePrimitiveKeyword("number"),
							]), false
						),
						new DeclaredProperty("a", new DeclaredPropertyTypePrimitiveKeyword("boolean"), false)
					));
			});

			it('should detect different types for the same parameter as a non empty intersection', () => {
				let parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method-union-type.d.ts").parse();
				let parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method-different-type-union.d.ts").parse();

				const comparator = new Comparator();
				const differences = comparator.compare(parsedClassExpected, parsedClassActual).differences;
				expect(differences)
					.toContainEqual(new ParameterTypeNonEmptyIntersectionDifference(
						new DeclaredProperty(
							"a",
							new DeclaredPropertyTypeUnionType([
								new DeclaredPropertyTypePrimitiveKeyword("string"),
								new DeclaredPropertyTypePrimitiveKeyword("number"),
							]), false
						),
						new DeclaredProperty("a", new DeclaredPropertyTypePrimitiveKeyword("string"), false)
					));

				expect(differences)
					.toContainEqual(new ParameterTypeNonEmptyIntersectionDifference(
						new DeclaredProperty(
							"a",
							new DeclaredPropertyTypeUnionType([
								new DeclaredPropertyTypePrimitiveKeyword("string"),
								new DeclaredPropertyTypePrimitiveKeyword("number"),
								new DeclaredPropertyTypePrimitiveKeyword("boolean"),
							]), false
						),
						new DeclaredProperty(
							"a",
							new DeclaredPropertyTypeUnionType([
								new DeclaredPropertyTypePrimitiveKeyword("string"),
								new DeclaredPropertyTypePrimitiveKeyword("boolean"),
							]), false
						),
					));

				expect(differences)
					.toContainEqual(new ParameterTypeNonEmptyIntersectionDifference(
						new DeclaredProperty(
							"a",
							new DeclaredPropertyTypePrimitiveKeyword("string"),
							true
						),
						new DeclaredProperty(
							"a",
							new DeclaredPropertyTypePrimitiveKeyword("undefined"),
							false
						),
					));
			});

			it('should ignore differences in the name for the same parameter', () => {
				let parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method.d.ts").parse();
				let parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method-same-parameter-different-name.d.ts").parse();

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual).differences).toHaveLength(0);
			});

			it('should detect missing parameters', () => {
				const parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method.d.ts").parse();
				const parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method-missing-parameter.d.ts").parse();

				const comparator = new Comparator();
				const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
				expect(result)
					.toContainEqual(new ParameterMissingDifference(
						{
							name: "a",
							type: {
								kind: "primitive_keyword",
								value: "string"
							},
							optional: false
						}
					));
			});

			it('should detect extra parameters', () => {
				const parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method.d.ts").parse();
				const parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/method/parameters/one-class-one-method-extra-parameter.d.ts").parse();

				const comparator = new Comparator();
				const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
				expect(result)
					.toContainEqual(new ParameterExtraDifference(
						{
							name: "b",
							type: {
								kind: "primitive_keyword",
								value: "string"
							},
							optional: false
						}
					));
			});
		});

		it.skip('should detect missing methods', () => {});
	});

	describe('interfaces', () => {
		it('should detect differences in the types of the common properties', () => {
			let parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class.d.ts").parse();
			let parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class-with-different-constructor-parameter-type.d.ts").parse();

			const comparator = new Comparator();
			let result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
			expect(result)
				.toContainEqual(new ParameterTypeEmptyIntersectionDifference(
					{
						name: "a",
						type: {
							kind: "primitive_keyword",
							value: "string"
						},
						optional: false
					},
					{
						name: "a",
						type: {
							kind: "primitive_keyword",
							value: "number"
						},
						optional: false
					}
				));
			
			expect(result)
				.toContainEqual(new ParameterTypeEmptyIntersectionDifference(
					{
						name: "c",
						type: {
							kind: "array_type",
							value: {
								kind: "primitive_keyword",
								value: "string"
							}
						},
						optional: false
					},
					{
						name: "c",
						type: {
							kind: "array_type",
							value: {
								kind: "primitive_keyword",
								value: "number"
							}
						},
						optional: false
					}
				));
		});

		it('should detect missing properties of the interface', () => {
			const parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class.d.ts").parse();
			const parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class-missing-properties.d.ts").parse();

			const comparator = new Comparator();
			const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
			expect(result)
				.toContainEqual(new ParameterMissingDifference(
					{
						name: "b",
						type: {
							kind: "primitive_keyword",
							value: "number"
						},
						optional: false
					}
				));

			expect(result)
				.toContainEqual(new ParameterMissingDifference(
					{
						name: "c",
						type: {
							kind: "array_type",
							value: {
								kind: "primitive_keyword",
								value: "string"
							}
						},
						optional: false
					}
				));
		});

		it('should detect extra properties', () => {
			const parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class.d.ts").parse();
			const parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class-extra-properties.d.ts").parse();

			const comparator = new Comparator();
			const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
			expect(result)
				.toContainEqual(new ParameterExtraDifference(
					{
						name: "something",
						type: {
							kind: "primitive_keyword",
							value: "number"
						},
						optional: false
					}
				));

			expect(result)
				.toContainEqual(new ParameterExtraDifference(
					{
						name: "anotherThing",
						type: {
							kind: "array_type",
							value: {
								kind: "primitive_keyword",
								value: "string"
							}
						},
						optional: false
					}
				));
		});

		it('should detect be able to handle recursively nested Interfaces', () => {
			const parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class.d.ts").parse();
			const parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class-nested-interfaces.d.ts").parse();

			const comparator = new Comparator();
			const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
			expect(result)
				.toContainEqual(new ParameterTypeEmptyIntersectionDifference(
					new DeclaredProperty(
						"b",
						new DeclaredPropertyTypePrimitiveKeyword("number"),
						false
					),
					new DeclaredProperty(
						"b",
						new DeclaredPropertyTypePrimitiveKeyword("string"),
						false
					)
				));
		});

		it('should ignore differences in the names of the same Interface', () => {
			const parsedClassExpected = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class.d.ts").parse();
			const parsedClassActual = new DeclarationFileParser("tests/files/comparator-module-class/interfaces/one-class-different-interface-name.d.ts").parse();

			const comparator = new Comparator();
			const result = comparator.compare(parsedClassExpected, parsedClassActual).differences;
			expect(result).toHaveLength(0);
		});
	});
});