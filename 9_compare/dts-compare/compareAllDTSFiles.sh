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

		if [ -f "$DEFINITELY_TYPED_FILE" ]; then
			echo "Comparing DTS for $MODULE_NAME"

			docker run --rm -v $DEFINITELY_TYPED_FILE:/usr/local/app/expected.d.ts -v $GENERATED_FILE:/usr/local/app/actual.d.ts \
				dts-compare --expected-declaration-file expected.d.ts \
					--actual-declaration-file actual.d.ts \
					--output-format csv \
					--module-name $MODULE_NAME | tee -a $OUTPUT_FILE
		fi
    done