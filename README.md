# dts-generate
## Installation
Clone this repository and then run:

```shell
./install.sh
```

## Usage
```shell
./0_method/dts-generate [NPM_MODULE] [OUTPUT_DIRECTORY]
```

## Example
```shell
./0_method/dts-generate abs /tmp/output
```

### 1_extract-modules
Extracts a list of node modules from the DefinitelyTyped repository.

### 2_get-repositories
Extracts the git repository for each of the extracted modules in step 1.

### 3_extract-readme
Extracts the readme files from the git repository.

### 4_ extract-code
Extracts javascript code from the readme files.

### 5_run-js-modules
Executes the extracted code and verifies if it throws any errors.

### 6_get-runtime-information
Extracts runtime information for the working modules.

### 7_generate-declaration-files
Generates declaration files for the working modules.

### 8_parse-dts
* **DEPRECATED** See 9_compare
* Parses declaration files.
* Extracts the type of the declaration file (module.d.ts, module-function.d.ts, module-class.d.ts).
* Compares the generated declaration file with the declaration file in the Definitely Typed repo.

