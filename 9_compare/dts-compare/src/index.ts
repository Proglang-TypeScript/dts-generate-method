#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import Comparator from './Comparator';
import DeclarationFileParser from './parser/DeclarationFileParser';
import fs from 'fs';
import Formatter from './formatters/Formatter';
import JsonFormatter from './formatters/JsonFormatter';
import CSVFormatter from './formatters/CSVFormatter';

const optionDefinitions = [
  {
    name: 'actual-declaration-file',
    alias: 'a',
    type: String,
    defaultValue: '',
  },
  {
    name: 'expected-declaration-file',
    alias: 'e',
    type: String,
    defaultValue: '',
  },
  { name: 'output-file', alias: 'o', type: String, defaultValue: '' },
  { name: 'output-format', type: String, defaultValue: 'json' },
  { name: 'module-name', type: String, defaultValue: null },
];

const options = commandLineArgs(optionDefinitions);

const comparator = new Comparator();

const formatters = new Map<string, Formatter>();
formatters.set('json', new JsonFormatter());
formatters.set('csv', new CSVFormatter());

try {
  const expectedFileParser = new DeclarationFileParser(options['expected-declaration-file']);
  const actualFileParser = new DeclarationFileParser(options['actual-declaration-file']);

  const resultComparison = comparator.compare(expectedFileParser.parse(), actualFileParser.parse());

  const content = formatters
    .get(options['output-format'])
    ?.format(
      options['module-name'] ? options['module-name'] : options['expected-declaration-file'],
      resultComparison,
      expectedFileParser.tags,
    );

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
