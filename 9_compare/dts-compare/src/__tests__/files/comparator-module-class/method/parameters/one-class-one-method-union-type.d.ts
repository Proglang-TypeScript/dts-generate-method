export default OneClass;

declare class OneClass {
  next(a: string | number): string;
  anotherNext(a: string | number | boolean): string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  myMethod(b: any, c: 'hello', d: 1 | 2 | 3 | 4 | 5, a?: string): string;
}

declare namespace OneClass {}
