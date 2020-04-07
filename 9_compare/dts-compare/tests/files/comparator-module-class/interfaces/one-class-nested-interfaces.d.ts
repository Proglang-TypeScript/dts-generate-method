export default OneClass;

declare class OneClass {
	constructor(a: OneClass.SomeInterface);
}

declare namespace OneClass {
	export interface SomeInterface {
		a: string;
		b: number;
		c: string[];
		d: OneClass.AnotherInterface;
	}

	export interface AnotherInterface {
		a: string;
		b: string;
	}
}