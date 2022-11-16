#!/usr/bin/env node

import DeclarationFileParser from './parser/DeclarationFileParser';
import commandLineArgs from 'command-line-args';
import fs from 'fs';

const optionDefinitions = [
  {
    name: 'input-declaration-file',
    alias: 'i',
    type: String,
    defaultValue: null,
  },
  { name: 'output-file', alias: 'o', type: String, defaultValue: '' },
];

const options = commandLineArgs(optionDefinitions);

const parser = new DeclarationFileParser(options['input-declaration-file']);

try {
  const result = parser.countTags();

  const content = JSON.stringify(Object.fromEntries(result));

  if (options['output-file'] === '') {
    // eslint-disable-next-line no-console
    console.log(content);
  } else {
    fs.writeFileSync(options['output-file'], content);
  }
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Error: ');
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
}
