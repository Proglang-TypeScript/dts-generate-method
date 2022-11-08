#!/usr/bin/env node

import DeclarationFileParser from './parser/DeclarationFileParser';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import { getAllTags } from './parser/tags/tags';

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
  const declarationMap = parser.parse();

  const getCircularReplacer = () => {
    const seen = new WeakSet();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return { name: value.name, circular: true };
        }
        seen.add(value);
      }
      return value;
    };
  };

  const result = {
    parsing: declarationMap,
    tags: {} as { [t: string]: number },
  };

  getAllTags().forEach((t) => {
    result.tags[t] = Number(parser.tags.get(t));
  });

  const content = JSON.stringify(result, getCircularReplacer(), 4);

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
