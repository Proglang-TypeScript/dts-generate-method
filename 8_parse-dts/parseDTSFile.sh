#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

DECLARATION_FILE=$1
OUTPUT_DIRECTORY=$2

mkdir -p $OUTPUT_DIRECTORY

CONTAINER_NAME=$(LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c 20 ; echo)

moduleName=$(basename "$(dirname "$DECLARATION_FILE")")

docker run \
	--name $CONTAINER_NAME \
	-v $DECLARATION_FILE:/tmp/file.d.ts \
	-v $SCRIPT_PATH/$OUTPUT_DIRECTORY/$moduleName:/tmp/output-parse \
	parse-dts \
	node dist/index.js \
	-i /tmp/file.d.ts \
	-o /tmp/output-parse/parsed-dts.json

docker rm $CONTAINER_NAME > /dev/null 2>&1