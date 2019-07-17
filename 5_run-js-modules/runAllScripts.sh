#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

JS_FILES_DIRECTORY=$1

rm -f $SCRIPT_PATH/run_modules.log
touch -f $SCRIPT_PATH/run_modules.log

for f in $JS_FILES_DIRECTORY/*; do
	moduleName=${f##*/}
  
  echo "Running module '$moduleName' ..."

  for js_file in $f/*.js; do
	  $SCRIPT_PATH/runScript.sh $js_file $moduleName
  done
done