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
const comparator = new Comparator();

try {
	const resultComparation = comparator.compare(
		parser.parse(options['definitely-typed-file']),
		parser.parse(options['generated-file'])
	);

	console.log(JSON.stringify(resultComparation, null, 4));
} catch (error) {
	console.log("Error: " + JSON.stringify(error));
	process.exit(1);	
}