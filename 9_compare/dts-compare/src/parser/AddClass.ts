import { DeclaredClass } from "./model/DeclaredClass";

export interface AddClass {
  addClass(c: DeclaredClass): void;
}
