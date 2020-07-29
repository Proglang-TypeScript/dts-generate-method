#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
ROOT_PATH=$SCRIPT_PATH/..

JS_FILES=$1
RUN_TIME_INFO_DIRECTORY=$2

rm -rf $SCRIPT_PATH/modules
mkdir $SCRIPT_PATH/modules

while IFS= read -r JS_FILE
do
	echo "Generating declaration file for: $JS_FILE ..."

	MODULE_NAME=$(dirname "${JS_FILE}")
	JS_FILE_NAME=$(basename "${JS_FILE}")

	if [ ! -d "$SCRIPT_PATH/modules/$MODULE_NAME" ]; then
		mkdir $SCRIPT_PATH/modules/$MODULE_NAME
	fi

	mkdir $SCRIPT_PATH/modules/$MODULE_NAME/$JS_FILE_NAME

	cp $RUN_TIME_INFO_DIRECTORY/$JS_FILE/index.js $SCRIPT_PATH/modules/$MODULE_NAME/$JS_FILE_NAME/index.js

	mkdir $SCRIPT_PATH/modules/$MODULE_NAME/$JS_FILE_NAME/typescript

	$ROOT_PATH/lib/cli/generateDeclarationFile.sh \
		$RUN_TIME_INFO_DIRECTORY/$MODULE_NAME/$JS_FILE_NAME/output/output.json \
		$MODULE_NAME \
		$SCRIPT_PATH/modules/$MODULE_NAME/$JS_FILE_NAME/typescript

done < "$JS_FILES"

echo "Cleaning output directory ..."

$SCRIPT_PATH/cleanDeclarationFilesDirectory.sh $SCRIPT_PATH/modules