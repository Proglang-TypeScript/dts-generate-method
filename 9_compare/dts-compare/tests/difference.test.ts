import { DeclaredPropertyTypeUnionType } from '../src/parser/model/declared-property-types/DeclaredPropertyTypeUnionType';
import { DeclaredPropertyTypePrimitiveKeyword } from '../src/parser/model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';
import ParameterTypeDifference from '../src/difference/ParameterTypeDifference';
import { DeclaredProperty } from '../src/parser/model/DeclaredProperty';
import LowSeverity from '../src/severity/LowSeverity';
import CriticalSeverity from '../src/severity/CriticalSeverity';

describe('Difference', () => {
	describe('ParameterTypeDifference', () => {
		it('should return low severity when expected is a union type and actual is one of those types', () => {
			const unionType = new DeclaredPropertyTypeUnionType([
				new DeclaredPropertyTypePrimitiveKeyword("string"),
				new DeclaredPropertyTypePrimitiveKeyword("number"),
				new DeclaredPropertyTypePrimitiveKeyword("boolean"),
			]); // unionType = string | number | boolean;

			const booleanType = new DeclaredPropertyTypePrimitiveKeyword("boolean");

			const difference = new ParameterTypeDifference(
				new DeclaredProperty("a", unionType, false),
				new DeclaredProperty("b", booleanType, false)
			);

			expect(difference.getSeverity().getCode()).toEqual(new LowSeverity().getCode());
		});

		it('should return low severity when expected is a union type and actual is a union type with less types', () => {
			const unionType = new DeclaredPropertyTypeUnionType([
				new DeclaredPropertyTypePrimitiveKeyword("string"),
				new DeclaredPropertyTypePrimitiveKeyword("number"),
				new DeclaredPropertyTypePrimitiveKeyword("boolean"),
			]); // unionType = string | number | boolean;

			const unionTypeWithLessTypes = new DeclaredPropertyTypeUnionType([
				new DeclaredPropertyTypePrimitiveKeyword("string"),
				new DeclaredPropertyTypePrimitiveKeyword("boolean"),
			]); // unionType = string | boolean;

			const difference = new ParameterTypeDifference(
				new DeclaredProperty("a", unionType, false),
				new DeclaredProperty("b", unionTypeWithLessTypes, false)
			);

			expect(difference.getSeverity().getCode()).toEqual(new LowSeverity().getCode());
		});

		it('should return critical severity when expected is a union type and actual is not one of those types', () => {
			const unionType = new DeclaredPropertyTypeUnionType([
				new DeclaredPropertyTypePrimitiveKeyword("string"),
				new DeclaredPropertyTypePrimitiveKeyword("number"),
			]); // unionType = string | number;

			const booleanType = new DeclaredPropertyTypePrimitiveKeyword("boolean");

			const difference = new ParameterTypeDifference(
				new DeclaredProperty("a", unionType, false),
				new DeclaredProperty("b", booleanType, false)
			);

			expect(difference.getSeverity().getCode()).toEqual(new CriticalSeverity().getCode());
		});
	});
});