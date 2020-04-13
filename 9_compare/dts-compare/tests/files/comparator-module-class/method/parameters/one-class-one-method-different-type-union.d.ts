export default OneClass;

declare class OneClass {
	next(a: string): string;
	anotherNext(a: string | boolean): string;
	myMethod(a: undefined): string;
}

declare namespace OneClass {
}