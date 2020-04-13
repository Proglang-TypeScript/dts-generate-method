#!/usr/bin/env node

import  DeclarationFileParser from './parser/DeclarationFileParser';
import commandLineArgs from 'command-line-args';
import fs from 'fs';

const optionDefinitions = [
    { name: 'input-declaration-file', alias: 'i', type: String, defaultValue: null },
    { name: 'output-file', alias: 'o', type: String, defaultValue: ''}
];

let options = commandLineArgs(optionDefinitions);

let parser = new DeclarationFileParser(options['input-declaration-file']);

try {
	let declarationMap = parser.parse();

	const getCircularReplacer = () => {
		const seen = new WeakSet();
		return (key: string, value: any) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return { name: value.name, circular: true };
				}
				seen.add(value);
			}
			return value;
		};
	};

	const content = JSON.stringify(declarationMap, getCircularReplacer(), 4);

	if (options['output-file'] === '') {
		console.log(content);
	} else {
		fs.writeFileSync(
			options['output-file'],
			content
		);
	}
} catch (error) {
	console.error("Error: ");
	console.error(error);
	process.exit(1);
}