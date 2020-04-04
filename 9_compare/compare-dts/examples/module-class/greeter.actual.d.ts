export default Greeter;

declare class Greeter {
	constructor(message: string);
	showGreeting(p: Greeter.Person): void;
	logMessage(): void;
}

declare namespace Greeter {
	export interface Person {
		name: string;
		lastName: string;
	}
}