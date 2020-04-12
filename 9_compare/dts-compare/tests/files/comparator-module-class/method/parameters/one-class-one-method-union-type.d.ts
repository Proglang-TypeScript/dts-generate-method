export default OneClass;

declare class OneClass {
	next(a: string | number): string;
	anotherNext(a: string | number | boolean): string;
}

declare namespace OneClass {
}