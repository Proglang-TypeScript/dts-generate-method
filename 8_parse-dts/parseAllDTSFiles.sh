#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

DECLARATION_FILES_DIRECTORY=$1
OUTPUT_DIRECTORY=$2

rm -rf $OUTPUT_DIRECTORY

find $DECLARATION_FILES_DIRECTORY -name 'index.d.ts' -print0 | 
    while IFS= read -r -d '' f; do 
		moduleName=$(basename "$(dirname "$f")")
        echo "Parsing DTS for $moduleName ..."

		$SCRIPT_PATH/parseDTSFile.sh $f $OUTPUT_DIRECTORY
    done