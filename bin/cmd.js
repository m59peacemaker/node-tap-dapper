#!/usr/bin/env node

const through = require('throo')
const exitCode = require('tap-exit-code')
const tapeUnsummarize = require('tape-unsummarize')
const prefixLines = require('prefix-stream-lines')
const reporter = require('../')

process.stdin
  .pipe(exitCode())
  .pipe(tapeUnsummarize())
  .pipe(reporter())
  .pipe(prefixLines('  '))
  .pipe(process.stdout)
