export default OneClass;

declare class OneClass {
	constructor(a: OneClass.SomeInterface);
}

declare namespace OneClass {
	export interface SomeInterface {
		a: string;
		b: number;
		c: string[];
		d: AnotherInterfaceWithAnotherName;
	}

	export interface AnotherInterfaceWithAnotherName {
		a: string;
		b: number;
	}
}