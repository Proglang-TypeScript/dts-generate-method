export = Greeter;

declare class Greeter {
	constructor(message: number);
	showGreeting(p: Greeter.Personnnn, extraParameter: number[]): void;
	logMessage(m: string): string;
	logMessage(m: boolean): string;
}

declare namespace Greeter {
	export interface Personnnn {
		name: string;
		lastName: string;
	}
}