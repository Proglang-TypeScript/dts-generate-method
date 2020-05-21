export default Greeter;

declare class Greeter {
	constructor(a: Greeter.Node);
}

declare namespace Greeter {
	export interface Node {
		parent: Greeter.Node
	}
}