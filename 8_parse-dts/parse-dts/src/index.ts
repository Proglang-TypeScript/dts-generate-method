import { DeclarationFileParser } from './DeclarationFileParser';
import commandLineArgs from 'command-line-args';
import * as fs from 'fs';

const optionDefinitions = [
    { name: 'input-declaration-file', alias: 'i', type: String, defaultValue: null },
    { name: 'output-file', alias: 'o', type: String, defaultValue: './parsed-dts.json'}
];

let options = commandLineArgs(optionDefinitions);

let parser = new DeclarationFileParser();
let declarationMap = parser.parse(options['input-declaration-file']);

fs.writeFileSync(
	options['output-file'],
	JSON.stringify(declarationMap, null, '\t')
);