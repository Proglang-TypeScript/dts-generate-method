#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

PARSED_DECLARATION_FILE=$1

NUMBER_OF_EXPORTED_CLASSES=$(cat $PARSED_DECLARATION_FILE | jq '.classes | length')
NUMBER_OF_EXPORTED_FUNCTIONS=$(cat $PARSED_DECLARATION_FILE | jq '.functions | length')
NUMBER_OF_UNIQUE_EXPORTED_FUNCTIONS=$(cat $PARSED_DECLARATION_FILE | jq '.functions[].name' | sort -u | wc -l | tr -d '[:space:]')
NUMBER_OF_EXPORT_ASSIGNMENTS=$(cat $PARSED_DECLARATION_FILE | jq '.exportAssignments | length')
EXPORT_ASSIGNMENT=$(cat $PARSED_DECLARATION_FILE | jq '.exportAssignments | join("")')

TYPE="module"
if [ "$NUMBER_OF_EXPORTED_CLASSES" = "1" ] && [ "$NUMBER_OF_EXPORTED_FUNCTIONS" = "0" ]; then
	NAME_OF_CLASS=$(cat $PARSED_DECLARATION_FILE | jq '.classes[0].name')

	if [ "$NAME_OF_CLASS" = "$EXPORT_ASSIGNMENT" ]; then
		TYPE="module-class"
	fi
fi

if [ "$NUMBER_OF_UNIQUE_EXPORTED_FUNCTIONS" = "1" ] && [ "$NUMBER_OF_EXPORTED_CLASSES" = "0" ]; then
	NAME_OF_FUNCTION=$(cat $PARSED_DECLARATION_FILE | jq '.functions[0].name')

	if [ "$NAME_OF_FUNCTION" = "$EXPORT_ASSIGNMENT" ]; then
		TYPE="module-function"
	fi
fi

echo $TYPE
