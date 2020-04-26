export = Greeter;

declare function Greeter(a: string): number;

declare class Greeter {
	constructor(message: string | string[]);
	constructor(message: number);
	showGreeting(p: Greeter.Person): void;
	logMessage(m5: string): void;
	logMessage(m: number): string;
	logMessage(m1: string): string;
}

declare namespace Greeter {
	export interface Person {
		name: string;
		lastName: string;
		address: string;
		age: number; 
	}
}