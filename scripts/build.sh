#!/bin/bash

DIST_FILE="dist/bokehmol.min.js"

bokeh build
[[ -f $DIST_FILE ]] && cp $DIST_FILE bokehmol/
python -m build
