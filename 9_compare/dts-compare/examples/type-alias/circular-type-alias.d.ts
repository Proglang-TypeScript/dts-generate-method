export = A

declare type Interpolation<P> =
	string
	| InterpolationFunction<P>;

declare type InterpolationFunction<P> = (props: P) => Interpolation<P>;

declare function A(a: Interpolation<number>): string;