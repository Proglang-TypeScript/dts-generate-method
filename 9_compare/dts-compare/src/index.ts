#!/usr/bin/env node

import commandLineArgs from "command-line-args";
import Comparator from "./Comparator";
import DeclarationFileParser from "./parser/DeclarationFileParser";
import fs from "fs";
import Formatter from "./formatters/Formatter";
import JsonFormatter from "./formatters/JsonFormatter";
import CSVFormatter from "./formatters/CSVFormatter";

const optionDefinitions = [
  {
    name: "actual-declaration-file",
    alias: "a",
    type: String,
    defaultValue: "",
  },
  {
    name: "expected-declaration-file",
    alias: "e",
    type: String,
    defaultValue: "",
  },
  { name: "output-file", alias: "o", type: String, defaultValue: "" },
  { name: "output-format", type: String, defaultValue: "json" },
  { name: "module-name", type: String, defaultValue: null },
];

let options = commandLineArgs(optionDefinitions);

const comparator = new Comparator();

const formatters = new Map<string, Formatter>();
formatters.set("json", new JsonFormatter());
formatters.set("csv", new CSVFormatter());

try {
  let expectedFileParser = new DeclarationFileParser(
    options["expected-declaration-file"]
  );
  let actualFileParser = new DeclarationFileParser(
    options["actual-declaration-file"]
  );

  const resultComparison = comparator.compare(
    expectedFileParser.parse(),
    actualFileParser.parse()
  );

  const content = formatters
    .get(options["output-format"])
    ?.format(
      options["module-name"]
        ? options["module-name"]
        : options["expected-declaration-file"],
      resultComparison,
      expectedFileParser.tags
    );

  if (options["output-file"] === "") {
    console.log(content);
  } else {
    fs.writeFileSync(options["output-file"], content);
  }
} catch (error) {
  console.error("Error: ");
  console.error(error);
  process.exit(1);
}
