#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

DEFINITELY_TYPED_REPO="https://github.com/DefinitelyTyped/DefinitelyTyped.git"
DEST_FOLDER=$1
MODULES_FILE=modules.csv

rm -rf $SCRIPT_PATH/$DEST_FOLDER

git clone $DEFINITELY_TYPED_REPO $SCRIPT_PATH/$DEST_FOLDER

echo "Extracting modules ..."
ls $SCRIPT_PATH/$DEST_FOLDER/types > $SCRIPT_PATH/$MODULES_FILE

echo "Done"
echo ""
echo "Path to file:"
echo $SCRIPT_PATH/$MODULES_FILE

rm -rf $SCRIPT_PATH/$DEST_FOLDER