#!/bin/bash
cd /home/kavia/workspace/code-generation/basiccalc-web-6213-f83afba6/calculator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

