#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

JS_FILE=$1
OUTPUT_DIRECTORY=$2
PLAYGROUND=/tmp/playground

rm -rf $PLAYGROUND
mkdir $PLAYGROUND

MODULE_NAME=$(basename "$(dirname "${JS_FILE}")")
JS_FILE_NAME=$(basename "${JS_FILE}")

echo "Generating declaration file for module $MODULE_NAME ..."

cp $JS_FILE $PLAYGROUND/index.js
npm --prefix $PLAYGROUND install $MODULE_NAME

rm -rf $OUTPUT_DIRECTORY/$JS_FILE_NAME/typescript
mkdir -p $OUTPUT_DIRECTORY/$JS_FILE_NAME/typescript

$SCRIPT_PATH/../lib/bin/run.sh \
	$PLAYGROUND/index.js \
	$MODULE_NAME \
		$OUTPUT_DIRECTORY/$JS_FILE_NAME/typescript

rm -rf $PLAYGROUND