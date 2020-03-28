export default Greeter;

declare class Greeter {
	constructor(message: string);
	showGreeting(): void;
}

declare namespace Greeter {
}