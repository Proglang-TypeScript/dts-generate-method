#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

JS_FILES=$1
JS_CODE_DIRECTORY=$2

rm -rf $SCRIPT_PATH/runtime-info
mkdir $SCRIPT_PATH/runtime-info

rm -f $SCRIPT_PATH/runtime-info.log
touch -f $SCRIPT_PATH/runtime-info.log

while IFS= read -r JS_FILE
do
	echo "Generating runtime information file for: $JS_FILE ..."

	MODULE_NAME=$(dirname "${JS_FILE}")
	JS_FILE_NAME=$(basename "${JS_FILE}")

	mkdir -p $SCRIPT_PATH/runtime-info/$MODULE_NAME
	mkdir -p $SCRIPT_PATH/runtime-info/$MODULE_NAME/$JS_FILE_NAME

	sed 's/const /var /g' $JS_CODE_DIRECTORY/$JS_FILE > $SCRIPT_PATH/runtime-info/$MODULE_NAME/$JS_FILE_NAME/index.js

	npm --prefix $SCRIPT_PATH/runtime-info/$MODULE_NAME/$JS_FILE_NAME install $MODULE_NAME

	mkdir -p $SCRIPT_PATH/runtime-info/$MODULE_NAME/$JS_FILE_NAME/output

	OUTPUT_RUNTIME=$($SCRIPT_PATH/../lib/cli/getRuntimeInformation.sh \
		$SCRIPT_PATH/runtime-info/$MODULE_NAME/$JS_FILE_NAME/index.js \
		$SCRIPT_PATH/runtime-info/$MODULE_NAME/$JS_FILE_NAME/output/output.json \
		120 2>&1)

	if [ -z "$OUTPUT_RUNTIME" ]
	then
		echo "${JS_FILE} - OK" >> ${SCRIPT_PATH}/runtime-info.log
	else
		echo "${JS_FILE} - NOK" >> ${SCRIPT_PATH}/runtime-info.log
	fi

done < "$JS_FILES"