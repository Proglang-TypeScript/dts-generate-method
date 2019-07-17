#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

JS_FILES=$1
JS_CODE_DIRECTORY=$2

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

	sed 's/const /var /g' $JS_CODE_DIRECTORY/$JS_FILE > $SCRIPT_PATH/modules/$MODULE_NAME/$JS_FILE_NAME/index.js

	npm --prefix $SCRIPT_PATH/modules/$MODULE_NAME/$JS_FILE_NAME install $MODULE_NAME

	mkdir $SCRIPT_PATH/modules/$MODULE_NAME/$JS_FILE_NAME/typescript

	$SCRIPT_PATH/../../ts-declaration-file-generator-service/bin/run.sh \
		$SCRIPT_PATH/modules/$MODULE_NAME/$JS_FILE_NAME/index.js \
		$MODULE_NAME \
		$SCRIPT_PATH/modules/$MODULE_NAME/$JS_FILE_NAME/typescript

done < "$JS_FILES"

echo "Cleaning output directory ..."

$SCRIPT_PATH/cleanDeclarationFilesDirectory.sh modules