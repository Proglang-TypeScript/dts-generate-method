#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

DECLARATION_FILES_DIRECTORY=$1

for MODULE_DIRECTORY in $DECLARATION_FILES_DIRECTORY/*; do
	MODULE_NAME=$(basename $MODULE_DIRECTORY)

	for f in $MODULE_DIRECTORY/*.js; do
		FILE=$f/typescript/$MODULE_NAME/index.d.ts

		echo $f

		if [ -s "$FILE" ]; then
			echo "Deleting node modules for $f"
			rm -rf $f/node_modules
		else
			echo "File is empty. Removing ..."
			rm -r $f
		fi
	done
done