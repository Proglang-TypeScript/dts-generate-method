export default Greeter;

declare class Greeter {
	constructor(a: Greeter.A);
}

declare namespace Greeter {
	export interface A {
		hello: string;
		world: string;
	}
}