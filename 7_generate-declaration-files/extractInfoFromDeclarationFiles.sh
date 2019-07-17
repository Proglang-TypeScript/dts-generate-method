#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

DECLARATION_FILES_DIRECTORY=$1

for MODULE_DIRECTORY in $DECLARATION_FILES_DIRECTORY/*; do
	MODULE_NAME=$(basename $MODULE_DIRECTORY)

	for f in $MODULE_DIRECTORY/*.js; do
		FILE=$f/typescript/$MODULE_NAME/index.d.ts

		if [ -f "$FILE" ]; then
			NUMBER_OF_LINES=$(cat $FILE | wc -l | tr -d '[:space:]')
			echo "$MODULE_NAME;$NUMBER_OF_LINES"
		fi
	done
done