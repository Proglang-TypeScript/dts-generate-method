#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
ROOT_PATH=$SCRIPT_PATH/..

MODULE=$1
OUTPUT_DIR=$SCRIPT_PATH/output-declaration-files

rm -rf $OUTPUT_DIR

# Extract readme
NPM_REPOSITORY=$(npm view $MODULE repository.url 2> /dev/null)
README_FILE=/tmp/readme-file.md
$ROOT_PATH/3_extract-readme/extractReadme.sh $NPM_REPOSITORY $README_FILE

# Extract code
OUTPUT_EXTRACTED_CODE=$SCRIPT_PATH/output-extracted-code
rm -rf $OUTPUT_EXTRACTED_CODE
mkdir $OUTPUT_EXTRACTED_CODE
$ROOT_PATH/4_extract-code/extractCodeFromReadme.sh $README_FILE $MODULE $OUTPUT_EXTRACTED_CODE
rm $README_FILE

# Generate Declaration File
for f in $OUTPUT_EXTRACTED_CODE/**/*.js; do
	[ -e "$f" ] || continue
	
	$ROOT_PATH/7_generate-declaration-files/generateDeclarationFile.sh $f $OUTPUT_DIR
done

rm -rf $OUTPUT_EXTRACTED_CODE