#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

MODULES=$1
OUTPUT_FILE=$SCRIPT_PATH/modulesWithRepository.csv

rm -f $OUTPUT_FILE
touch $OUTPUT_FILE

while IFS= read -r MODULE
do
	NPM_REPOSITORY=$(npm view $MODULE repository.url 2> /dev/null)
	
	echo "$MODULE,$NPM_REPOSITORY"
	
	echo "$MODULE,$NPM_REPOSITORY" >> $OUTPUT_FILE
done < "$MODULES"