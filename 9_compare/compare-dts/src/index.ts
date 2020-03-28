#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import Comparator from './Comparator';
import DeclarationFileParser from './parser/DeclarationFileParser';

const optionDefinitions = [
	{ name: 'generated-file', alias: 'g', type: String, defaultValue: '' },
	{ name: 'definitely-typed-file', alias: 'd', type: String, defaultValue: '' }
];

let options = commandLineArgs(optionDefinitions);

const parser = new DeclarationFileParser();

try {
	let parsedGeneratedFile = parser.parse(options['generated-file']);
	let parsedDefinitelyTypedFile = parser.parse(options['definitely-typed-file']);
	
	let comparator = new Comparator();

	let resultComparation = comparator.compare(parsedDefinitelyTypedFile, parsedGeneratedFile);
	
	console.log(JSON.stringify(resultComparation, null, 4));
} catch (error) {
	console.log("Error: " + JSON.stringify(error));
	process.exit(1);	
}