#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

NPM_REPOSITORY=$1
OUTPUT_FILE=$2

echo "Extracting readme file from repository: $NPM_REPOSITORY ..."

RAW_NPM_REPOSITORY="github.com${NPM_REPOSITORY#*github.com}"

RAW_GITHUB_URL_FRONT_URL="https://raw.githubusercontent.com"
RAW_GITHUB_URL=${RAW_NPM_REPOSITORY/github.com/$RAW_GITHUB_URL_FRONT_URL}

RAW_GITHUB_URL=${RAW_GITHUB_URL%".git"}
RAW_GITHUB_URL="${RAW_GITHUB_URL}/master"

echo "Attempting to download file $RAW_GITHUB_URL/README.md"

CURL=$(curl -L -o $OUTPUT_FILE --fail $RAW_GITHUB_URL/README.md 2>&1 > /dev/null)

echo "File in $OUTPUT_FILE"