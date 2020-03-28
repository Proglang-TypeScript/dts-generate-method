export default Greeter;

declare class Greeter {
	constructor(message: string);
	showGreeting(a: number): void;
}

declare namespace Greeter {
}