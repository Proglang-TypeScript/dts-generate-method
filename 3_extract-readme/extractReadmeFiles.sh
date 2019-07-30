#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

MODULES_WITH_GITHUB_REPO=$1

OUTPUT_DIRECTORY=$SCRIPT_PATH/readme-files

rm -rf $OUTPUT_DIRECTORY
mkdir $OUTPUT_DIRECTORY

while IFS=, read -r moduleName repo
do
    echo "Exctracting README file for module: $moduleName | $repo"

	RAW_GITHUB_URL_FRONT_URL="https://raw.githubusercontent.com"
	RAW_GITHUB_URL=${repo/github.com/$RAW_GITHUB_URL_FRONT_URL}

	RAW_GITHUB_URL=${RAW_GITHUB_URL%".git"}
	RAW_GITHUB_URL="${RAW_GITHUB_URL}/master"

	mkdir $OUTPUT_DIRECTORY/$moduleName

	CURL=$(curl -L -o $OUTPUT_DIRECTORY/$moduleName/readme.md --fail $RAW_GITHUB_URL/README.md 2>&1 > /dev/null)

done < $MODULES_WITH_GITHUB_REPO

COUNT_EMPTY_DIRECTORIES=$(find $OUTPUT_DIRECTORY -type d -empty | wc -l | tr -d '[:space:]')
echo "Cleaning empty directories: $COUNT_EMPTY_DIRECTORIES ..."

find $OUTPUT_DIRECTORY -type d -empty -delete