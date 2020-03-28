import fs from 'fs';

import Comparator from '../src/Comparator';
import ParameterTypeDifference from '../src/difference/ParameterTypeDifference';

describe('Comparator', () => {
	describe('templates', () => {
		it('should return no differences for same class', () => {
			const parsedClassFileName = "tests/files/comparator-module-class/one-class.json";
			let parsedClass1 = readJsonFromFile(parsedClassFileName);
			let parsedClass2 = readJsonFromFile(parsedClassFileName);

			const comparator = new Comparator();
			expect(comparator.compare(parsedClass1, parsedClass2)).toHaveLength(0);
		});
	});

	describe('methods', () => {
		describe('parameters', () => {
			it('should detect different types for the same parameter in the constructor', () => {
				let parsedClassExpected = readJsonFromFile("tests/files/comparator-module-class/constructor/parameters/one-class.json");
				let parsedClassActual = readJsonFromFile("tests/files/comparator-module-class/constructor/parameters/one-class-with-only-one-different-constructor-parameter-type.json");

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
				let parsedClassExpected = readJsonFromFile("tests/files/comparator-module-class/method/parameters/one-class-one-method.json");
				let parsedClassActual = readJsonFromFile("tests/files/comparator-module-class/method/parameters/one-class-one-method-different-parameter.json");

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
				let parsedClassExpected = readJsonFromFile("tests/files/comparator-module-class/method/parameters/one-class-one-method.json");
				let parsedClassActual = readJsonFromFile("tests/files/comparator-module-class/method/parameters/one-class-one-method-same-parameter-different-name.json");

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual)).toHaveLength(0);
			});

			it.skip('should detect extra parameters', () => { });
		});

		it.skip('should detect missing methods', () => {});
	});

	describe('interfaces', () => {
		it('should detect differences in the types of the common properties', () => {
			let parsedClassExpected = readJsonFromFile("tests/files/comparator-module-class/constructor/interfaces/one-class.json");
			let parsedClassActual = readJsonFromFile("tests/files/comparator-module-class/constructor/interfaces/one-class-with-only-one-different-constructor-parameter-type.json");

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

		it.skip('should detect missing properties of the interface', () => {
		});

		it.skip('should detect extra properties', () => {
		});

		it.skip('should detect be able to handle recursively nested Interfaces', () => {
		});
	});
});

function readJsonFromFile(fileName: string) {
	return JSON.parse(fs.readFileSync(fileName).toString());
} 