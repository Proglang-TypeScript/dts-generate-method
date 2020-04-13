export default OneClass;

declare class OneClass {
	next(a: string): string;
	anotherNext(a: string | boolean): string;
	myMethod(b: string, c: string, d: number, a: undefined): string;
}

declare namespace OneClass {
}