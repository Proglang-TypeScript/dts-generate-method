#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

RUNTIME_INFO_DIRECTORY=$1

find $RUNTIME_INFO_DIRECTORY -name 'output.json' -print0 | 
    while IFS= read -r -d '' f; do 
		jq -r '[.. | objects | select(.code == "operator")] | (map(keys) | add | unique) as $cols | map(. as $row | $cols | map($row[.])) as $rows | $rows[] | @csv' $f 2> /dev/null
    done