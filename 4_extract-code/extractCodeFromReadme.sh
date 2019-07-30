#!/bin/bash

README_FILE=$1
MODULE_NAME=$2
OUTPUT_CODE_DIRECTORY=$3

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

rm -rf $OUTPUT_CODE_DIRECTORY/$MODULE_NAME
mkdir $OUTPUT_CODE_DIRECTORY/$MODULE_NAME

AWK_ARG='/```js/{filename="'\
"$OUTPUT_CODE_DIRECTORY/$MODULE_NAME/$MODULE_NAME"\
'_"NR".js.tmp"}; {print>filename}'

cat $README_FILE | sed 's/```javascript/```js/g' | sed -n '/^```js/,/^```/ p' | sed 's/const /var /g' | \
awk "$AWK_ARG"

for f in $OUTPUT_CODE_DIRECTORY/$MODULE_NAME/*.js.tmp; do
	[ -e "$f" ] || continue
	if grep -q "require(" $f; then
		sed '1d' $f | sed '$d' > ${f%".tmp"}
	fi
done

rm -f $OUTPUT_CODE_DIRECTORY/$MODULE_NAME/*.js.tmp