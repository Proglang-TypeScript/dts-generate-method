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
* Parses declaration files.
* Extracts the type of the declaration file (module.d.ts, module-function.d.ts, module-class.d.ts).
* Compares the generated declaration file with the declaration file in the Definitely Typed repo.

