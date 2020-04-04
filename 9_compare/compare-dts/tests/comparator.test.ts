import fs from 'fs';

import Comparator from '../src/Comparator';
import ParameterTypeDifference from '../src/difference/ParameterTypeDifference';
import ParameterMissingDifference from '../src/difference/ParameterMissingDifference';

import DeclarationFileParser from '../src/parser/DeclarationFileParser';

const parser = new DeclarationFileParser();

describe('Comparator', () => {
	describe('templates', () => {
		it('should return no differences for same class', () => {
			const declarationFile = "tests/files/comparator-module-class/one-class.d.ts";

			const comparator = new Comparator();
			expect(comparator.compare(
				parser.parse(declarationFile),
				parser.parse(declarationFile)
			)).toHaveLength(0);
		});
	});

	describe('methods', () => {
		describe('parameters', () => {
			it('should detect different types for the same parameter in the constructor', () => {
				let parsedClassExpected = parser.parse("tests/files/comparator-module-class/constructor/parameters/one-class.d.ts");
				let parsedClassActual = parser.parse("tests/files/comparator-module-class/constructor/parameters/one-class-with-only-one-different-constructor-parameter-type.d.ts");

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual))
					.toContainEqual(new ParameterTypeDifference(
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
				let parsedClassExpected = parser.parse("tests/files/comparator-module-class/method/parameters/one-class-one-method.d.ts");
				let parsedClassActual = parser.parse("tests/files/comparator-module-class/method/parameters/one-class-one-method-different-parameter.d.ts");

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual))
					.toContainEqual(new ParameterTypeDifference(
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

			it('should ignore differences in the name for the same parameter', () => {
				let parsedClassExpected = parser.parse("tests/files/comparator-module-class/method/parameters/one-class-one-method.d.ts");
				let parsedClassActual = parser.parse("tests/files/comparator-module-class/method/parameters/one-class-one-method-same-parameter-different-name.d.ts");

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual)).toHaveLength(0);
			});

			it.skip('should detect extra parameters', () => { });
		});

		it.skip('should detect missing methods', () => {});
	});

	describe('interfaces', () => {
		it('should detect differences in the types of the common properties', () => {
			let parsedClassExpected = parser.parse("tests/files/comparator-module-class/interfaces/one-class.d.ts");
			let parsedClassActual = parser.parse("tests/files/comparator-module-class/interfaces/one-class-with-different-constructor-parameter-type.d.ts");

			const comparator = new Comparator();
			let result = comparator.compare(parsedClassExpected, parsedClassActual);
			expect(result)
				.toContainEqual(new ParameterTypeDifference(
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
				.toContainEqual(new ParameterTypeDifference(
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
			const parsedClassExpected = parser.parse("tests/files/comparator-module-class/interfaces/one-class.d.ts");
			const parsedClassActual = parser.parse("tests/files/comparator-module-class/interfaces/one-class-missing-properties.d.ts");

			const comparator = new Comparator();
			const result = comparator.compare(parsedClassExpected, parsedClassActual);
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

		it.skip('should detect extra properties', () => {
		});

		it.skip('should detect be able to handle recursively nested Interfaces', () => {
		});
	});
});