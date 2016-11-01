#!/usr/bin/env node

const through = require('throo')
const formSynopsis = require('tap-form-synopsis')
const combineStreams = require('../combine-streams-with-sequenced-end')
const reporter = require('../')

const reporterWithExitCode = () => {
  const formSynopsisStream = formSynopsis()
  formSynopsisStream
    .pipe(through.obj((push, synopsis, enc, cb) => {
      if (synopsis.failed.length) {
        process.on('exit', () => process.exit(1))
      }
      cb()
    }))
  const reporterStream = reporter()
  return combineStreams(reporterStream, formSynopsisStream)
}

process.stdin
  .pipe(reporterWithExitCode())
  .pipe(process.stdout)
