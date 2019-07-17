#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

README_FILES_DIRECTORY=$1
OUTPUT_CODE_DIRECTORY=code

rm -rf $SCRIPT_PATH/$OUTPUT_CODE_DIRECTORY
mkdir $SCRIPT_PATH/$OUTPUT_CODE_DIRECTORY

for f in $README_FILES_DIRECTORY/*; do
	moduleName=${f##*/}

	echo "Extracting code from $moduleName ..."

	$SCRIPT_PATH/extractCodeFromReadme.sh $f/readme.md $moduleName $SCRIPT_PATH/$OUTPUT_CODE_DIRECTORY
done