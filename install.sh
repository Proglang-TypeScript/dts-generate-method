#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

INSTALL_FOLDER=$SCRIPT_PATH/lib

rm -rf $INSTALL_FOLDER
mkdir $INSTALL_FOLDER

git clone https://github.com/proglang/ts-declaration-file-generator-service.git $INSTALL_FOLDER
$INSTALL_FOLDER/install.sh