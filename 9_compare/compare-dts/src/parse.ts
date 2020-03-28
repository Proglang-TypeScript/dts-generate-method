#!/usr/bin/env node

import  DeclarationFileParser from './parser/DeclarationFileParser';
import commandLineArgs from 'command-line-args';
import * as fs from 'fs';

const optionDefinitions = [
    { name: 'input-declaration-file', alias: 'i', type: String, defaultValue: null },
    { name: 'output-file', alias: 'o', type: String, defaultValue: ''}
];

let options = commandLineArgs(optionDefinitions);

let parser = new DeclarationFileParser();
let declarationMap = parser.parse(options['input-declaration-file']);

const content = JSON.stringify(declarationMap, null, '\t');
if (options['output-file'] === '') {
	console.log(content);
} else {
	fs.writeFileSync(
		options['output-file'],
		content
	);
}