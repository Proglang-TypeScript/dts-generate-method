#!/bin/bash

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

MODULE=$1
echo $(npm view $MODULE repository.url 2> /dev/null)