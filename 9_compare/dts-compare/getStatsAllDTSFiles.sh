#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
DECLARATION_FILES_DIRECTORY=$1

TMP_EMPTY_FILE=/tmp/empty-file.d.ts

touch $TMP_EMPTY_FILE
HEADER="\"module-name\"",`dts-parse -i $TMP_EMPTY_FILE | jq -r '.tags | keys_unsorted as $cols | $cols | @csv'`
rm -f $TMP_EMPTY_FILE

echo $HEADER
for MODULE_PATH in $DECLARATION_FILES_DIRECTORY/* ; do
		DECLARATION_FILE=$MODULE_PATH/index.d.ts
		VALUES=`dts-parse -i $DECLARATION_FILE | jq -r '.tags | map (.) as $rows | $rows | @csv'`

		MODULE_ONLY_NAME=`basename "$MODULE_PATH"`
		echo $MODULE_ONLY_NAME,$VALUES
    done