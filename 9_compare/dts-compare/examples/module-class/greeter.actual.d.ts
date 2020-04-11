export default Greeter;

declare class Greeter {
	constructor(message: number);
	showGreeting(p: Greeter.Personnnn, extraParameter: number[]): void;
	logMessage(): void;
}

declare namespace Greeter {
	export interface Personnnn {
		name: string;
		lastName: string;
	}
}