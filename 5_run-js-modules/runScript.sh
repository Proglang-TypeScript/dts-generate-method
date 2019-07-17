#!/bin/bash

JS_FILE=$1
MODULE_NAME=$2

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

JS_FILE_DIRECTORY=$(dirname "${JS_FILE}")

echo $JS_FILE_DIRECTORY

npm --prefix $JS_FILE_DIRECTORY install $MODULE_NAME

gtimeout 10 node $JS_FILE

ERROR_CODE=$?

if [ $ERROR_CODE -eq 0 ]
then
  echo "${JS_FILE} - OK"  >> $SCRIPT_PATH/run_modules.log
else
  if [ $ERROR_CODE -eq 124 ]
  then
    echo "${JS_FILE} - TIMEOUT" >> $SCRIPT_PATH/run_modules.log
  else
    echo "${JS_FILE} - NOK" >> $SCRIPT_PATH/run_modules.log
  fi
fi