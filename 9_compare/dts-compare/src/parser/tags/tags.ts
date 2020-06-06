enum TAGS {
	OPTIONAL = "optional-parameter",
	ANY = "type-any",
	ALIAS = "alias-type",
	LITERALS = "literals",
	ARRAY = "type-array",
	FUNCTION = "type-function",
	TUPLE = "type-tuple",
	INDEX_SIGNATURE = "index-signature",
	GENERICS_FUNCTION = "generics-function",
	GENERICS_CLASS = "generics-class",
	GENERICS_INTERFACE = "generics-interface",
	UNDEFINED = "undefined",
	PRIVATE = "private",
	PROTECTED = "protected",
	STATIC = "static",
	READONLY = "readonly",
	PUBLIC = "public",
	DOT_DOT_DOT_TOKEN = "dot-dot-dot-token",
	INTERSECTION = "type-intersection",
	CALL_SIGNATURE = "call-signature"
}

export function getAllTags(): string[] {
	return Object.keys(TAGS).map(key => {
		const tagKey = key as keyof typeof TAGS;
		return TAGS[tagKey];
	});
}

export default TAGS;