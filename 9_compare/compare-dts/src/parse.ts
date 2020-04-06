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
let declarationMap = parser.parse();

const content = JSON.stringify(declarationMap, null, '\t');
if (options['output-file'] === '') {
	console.log(content);
} else {
	fs.writeFileSync(
		options['output-file'],
		content
	);
}