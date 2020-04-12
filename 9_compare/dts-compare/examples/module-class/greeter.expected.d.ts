export default Greeter;

declare function Greeter(a: string): number;

declare class Greeter {
	constructor(message: string | string[]);
	showGreeting(p: Greeter.Person): void;
	logMessage(m: string): void;
}

declare namespace Greeter {
	export interface Person {
		name: string;
		lastName: string;
		address: string;
		age: number; 
	}
}