#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${DIR} && cd ..

zip --exclude=*.DS_Store* --exclude=*bin* --exclude=*.git* --exclude=*.iml --exclude=LICENSE --exclude=README.md -r draaft-chrome-extension.zip .
cd $PWD



