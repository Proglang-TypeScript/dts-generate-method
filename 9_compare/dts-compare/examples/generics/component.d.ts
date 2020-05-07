export interface Component<T extends object = any, S extends string = "hello"> {
	attrName?: string;
	data: T;
	dependencies?: string[];
	id: string;
	multiple?: boolean;
	name: string;
	system: S | undefined;

	init(data?: T): void;
	pause(): void;
	play(): void;
	remove(): void;
	tick?(time: number, timeDelta: number): void;
	update(oldData: T): void;
	updateSchema?(): void;
	flushToDOM(): void;
}