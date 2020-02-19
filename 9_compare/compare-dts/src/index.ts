import commandLineArgs from 'command-line-args';
import * as fs from 'fs';
import { Comparator } from './Comparator';


const optionDefinitions = [
	{ name: 'generated-file', alias: 'g', type: String, defaultValue: '' },
	{ name: 'definitely-typed-file', alias: 'd', type: String, defaultValue: '' }
];

let options = commandLineArgs(optionDefinitions);

try {
	let parsedGeneratedFile = JSON.parse(fs.readFileSync(options['generated-file']).toString());
	let parsedDefinitelyTypedFile = JSON.parse(fs.readFileSync(options['definitely-typed-file']).toString());
	
	let comparator = new Comparator();
	
	let resultComparation = comparator.compare(parsedDefinitelyTypedFile, parsedGeneratedFile);
	
	console.log(resultComparation);
} catch (error) {
	console.log("Error: " + JSON.stringify(error));
	process.exit(1);	
}