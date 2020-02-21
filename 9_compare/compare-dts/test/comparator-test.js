const chai = require("chai");
chai.use(require('chai-things'));
const expect = chai.expect;

const fs = require('fs');
const Comparator = require('../dist/Comparator').Comparator;
const ParameterTypeDifference = require('../dist/difference/ParameterTypeDifference').ParameterTypeDifference;

describe('Comparator', () => {
	describe('module-class', () => {
		it('should return no differences for same class', () => {
			const parsedClassFileName = "test/files/comparator-module-class/one-class.json";
			let parsedClass1 = readJsonFromFile(parsedClassFileName);
			let parsedClass2 = readJsonFromFile(parsedClassFileName);

			const comparator = new Comparator();
			expect(comparator.compare(parsedClass1, parsedClass2)).to.be.an('array').that.is.empty;
		});

		describe('constructor', () => {
			it('should detect different types for the same parameter', () => {
				let parsedClassExpected = readJsonFromFile("test/files/comparator-module-class/constructor/parameters/one-class.json");
				let parsedClassActual = readJsonFromFile("test/files/comparator-module-class/constructor/parameters/one-class-with-only-one-different-constructor-parameter-type.json");

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual))
					.to.be.an('array')
					.that.contains.something.that.deep.equals(new ParameterTypeDifference(
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
		});

		describe('methods', () => {
			it('should detect different types for the same parameter', () => {
				let parsedClassExpected = readJsonFromFile("test/files/comparator-module-class/method/parameters/one-class-one-method.json");
				let parsedClassActual = readJsonFromFile("test/files/comparator-module-class/method/parameters/one-class-one-method-different-parameter.json");

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual))
					.to.be.an('array')
					.that.contains.something.that.deep.equals(new ParameterTypeDifference(
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
				let parsedClassExpected = readJsonFromFile("test/files/comparator-module-class/method/parameters/one-class-one-method.json");
				let parsedClassActual = readJsonFromFile("test/files/comparator-module-class/method/parameters/one-class-one-method-same-parameter-different-name.json");

				const comparator = new Comparator();
				expect(comparator.compare(parsedClassExpected, parsedClassActual)).to.be.an('array').that.is.empty;
			});

			// it('should detect extra parameters', () => {
			// 	let parsedClassExpected = readJsonFromFile("test/files/comparator-module-class/method/parameters/one-class-one-method.json");
			// 	let parsedClassActual = readJsonFromFile("test/files/comparator-module-class/method/parameters/one-class-one-method-extra-parameter.json");

			// 	const comparator = new Comparator();
			// 	expect(comparator.compare(parsedClassExpected, parsedClassActual))
			// 		.to.be.an('array')
			// 		.that.contains.something.that.deep.equals(new ParameterTypeDifference(
			// 			null,
			// 			{
			// 				name: "b",
			// 				type: {
			// 					kind: "primitive_keyword",
			// 					value: "number"
			// 				},
			// 				optional: false
			// 			}
			// 		));
			// });
		});
	});
});

function readJsonFromFile(fileName) {
	return JSON.parse(fs.readFileSync(fileName).toString());
} 