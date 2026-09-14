#!/bin/bash
set -euo pipefail
SCRIPT_PATH="$(cd "$(dirname "$0")"; pwd -P)"
INSTALL_FOLDER="$SCRIPT_PATH/lib"
if [[ -e "$INSTALL_FOLDER" ]]; then
    BACKUP=$(mktemp -d "$SCRIPT_PATH/.preserved.XXXXXXXX")
    mv "$INSTALL_FOLDER" "$BACKUP/checkout"
    echo "Previous service checkout preserved at $BACKUP/checkout"
fi
git clone --no-checkout https://github.com/Proglang-TypeScript/ts-declaration-file-generator-service.git "$INSTALL_FOLDER"
git -C "$INSTALL_FOLDER" checkout --detach 6d6fbb5238f54a2a19354e9e7643e61de60b2e11
"$INSTALL_FOLDER/install.sh"
