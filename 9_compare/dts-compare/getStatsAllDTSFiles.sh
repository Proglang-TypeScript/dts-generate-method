#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
DECLARATION_FILES_DIRECTORY=$1

TMP_EMPTY_FILE=/tmp/empty-file.d.ts

touch $TMP_EMPTY_FILE
HEADER="\"module-name\"",`dts-parse -i $TMP_EMPTY_FILE | jq -r '.tags | keys_unsorted as $cols | $cols | @csv'`
rm -f $TMP_EMPTY_FILE

echo $HEADER

find $DECLARATION_FILES_DIRECTORY -name 'index.d.ts' -print0 | 
    while IFS= read -r -d '' DECLARATION_FILE; do 
		MODULE_NAME=$(basename "$(dirname "$DECLARATION_FILE")")

		VALUES=`dts-parse -i $DECLARATION_FILE | jq -r '.tags | map (.) as $rows | $rows | @csv'`
		echo $MODULE_NAME,$VALUES
    done