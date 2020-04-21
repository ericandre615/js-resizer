#!/bin/bash

find ./ -name '*.test.js' | xargs node

node ./bin/finish-tests.js
