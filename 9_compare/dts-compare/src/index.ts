#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import Comparator from './Comparator';
import DeclarationFileParser from './parser/DeclarationFileParser';
import fs from 'fs';

const optionDefinitions = [
	{ name: 'actual-declaration-file', alias: 'a', type: String, defaultValue: '' },
	{ name: 'expected-declaration-file', alias: 'e', type: String, defaultValue: '' },
	{ name: 'output-file', alias: 'o', type: String, defaultValue: '' }
];

let options = commandLineArgs(optionDefinitions);

const comparator = new Comparator();

try {
	const resultComparison = comparator.compare(
		new DeclarationFileParser(options['expected-declaration-file']).parse(),
		new DeclarationFileParser(options['actual-declaration-file']).parse()
	);

	const content = JSON.stringify(resultComparison, null, 4);

	if (options['output-file'] === '') {
		console.log(content);
	} else {
		fs.writeFileSync(
			options['output-file'],
			content
		);
	}
} catch (error) {
	console.log("Error: " + JSON.stringify(error));
	process.exit(1);
}