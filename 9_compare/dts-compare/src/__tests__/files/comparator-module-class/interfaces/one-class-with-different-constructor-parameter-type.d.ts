export default OneClass;

export interface SomeInterface {
  a: number;
  b: number;
  c: number[];
}

declare class OneClass {
  constructor(a: SomeInterface);
}

declare namespace OneClass {}
