#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

DECLARATION_FILES_DIRECTORY=$1
DEFINITELY_TYPED_DIRECTORY=$2
OUTPUT_FILE=$3

rm -f $OUTPUT_FILE
touch $OUTPUT_FILE

find $DECLARATION_FILES_DIRECTORY -name 'index.d.ts' -print0 | 
    while IFS= read -r -d '' GENERATED_FILE; do 
		MODULE_NAME=$(basename "$(dirname "$GENERATED_FILE")")
		DEFINITELY_TYPED_FILE=$2/types/$MODULE_NAME/index.d.ts

		echo "Comparing DTS for $MODULE_NAME"

		dts-compare --expected-declaration-file $DEFINITELY_TYPED_FILE \
			--actual-declaration-file $GENERATED_FILE \
			--output-format csv \
			--module-name $MODULE_NAME | tee -a $OUTPUT_FILE
    done