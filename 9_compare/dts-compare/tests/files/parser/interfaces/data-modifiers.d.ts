export = Glyph

declare class Glyph {
	private thisIsPrivate: string;
	protected thisIsProtected: number;
	public thisIsPublic: string;

	static THIS_IS_STATIC: boolean[];

	readonly thisIsReadOnly: boolean;
}