const chai = require("chai");
chai.use(require('chai-things'));
const expect = chai.expect;

const fs = require('fs');
const Comparator = require('../dist/Comparator').Comparator;
const ConstructorParameterTypeDifference = require('../dist/difference/ConstructorParameterTypeDifference').ConstructorParameterTypeDifference;

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
					.that.contains.something.that.deep.equals(new ConstructorParameterTypeDifference(
						0,
						"a",
						{
							kind: "primitive_keyword",
							value: "number"
						},
						{
							kind: "primitive_keyword",
							value: "string"
						}
					));
			});
		});
	});
});

function readJsonFromFile(fileName) {
	return JSON.parse(fs.readFileSync(fileName).toString());
} 