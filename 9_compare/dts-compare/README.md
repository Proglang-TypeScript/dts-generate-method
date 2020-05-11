# dts-compare
Command line tool for comparing two TypeScript declaration files. It includes `dts-parse`: a tool for parsing TypeScript declaration files.

## Install
```bash
$ npm install
$ npm run build
```

### Docker
```bash
$ sh build/build.sh
```

## Usage
### dts-compare
``` bash
$ dts-compare -e [EXPECTED-DECLARATIOn-FILE] -a [ACTUAL-DECLARATION-FILE] # Mandatory parameters
$ dts-compare -e [EXPECTED-DECLARATIOn-FILE] -a [ACTUAL-DECLARATION-FILE] -o [OUTPUT-FILE] # Prints to stdout by default
$ dts-compare -e [EXPECTED-DECLARATIOn-FILE] -a [ACTUAL-DECLARATION-FILE] -o [OUTPUT-FILE] --output-format ["csv" | "json"]
$ dts-compare -e [EXPECTED-DECLARATIOn-FILE] -a [ACTUAL-DECLARATION-FILE] --module-name [MODULE-NAME]
```

### dts-parse
```bash
$ dts-parse -i [DECLARATION-FILE]
$ dts-parse -i [DECLARATION-FILE] -o [OUTPUT-FILE] # Prints to stdout by default
```

## Example
```bash
$ dts-compare -e examples/module-function/myfunction.expected.d.ts -a examples/module-function/myfunction.actual.d.ts
```

```bash
$ dts-parse -i examples/module-function/myfunction.expected.d.ts
```

### Docker
```bash
$ docker run --rm -v $(pwd)/examples/module-function/myfunction.expected.d.ts:/usr/local/app/expected.d.ts -v $(pwd)/examples/module-function/myfunction.actual.d.ts:/usr/local/app/actual.d.ts dts-compare --expected-declaration-file expected.d.ts --actual-declaration-file actual.d.ts
```
