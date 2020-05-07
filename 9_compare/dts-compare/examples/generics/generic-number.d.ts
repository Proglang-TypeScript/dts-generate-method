export = GenericNumber

declare class GenericNumber<T> {
	zeroValue: T;
	add: (x: T, y: T) => T;
}

declare namespace GenericNumber {
	
}