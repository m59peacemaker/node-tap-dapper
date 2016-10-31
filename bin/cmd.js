#!/usr/bin/env node

const tapeUnsummarize = require('tape-unsummarize')
const format = require('tap-vibrant')
const formSynopsis = require('tap-form-synopsis')
const synopsis = require('tap-synopsis')
const through = require('throo')

const foo = (...streams) => {
  const stream = through((push, chunk, enc, cb) => {
    streams.forEach(s => s.write(chunk))
    cb()
  }, (push, cb) => {
    streams.reduce((prev, curr, idx) => {
      prev.on('end', () => curr.end())
      if (idx === streams.length - 1) {
        curr.on('end', cb)
      }
      return curr
    })
    streams[0].end()
  })
  streams.forEach(s => s.on('data', d => stream.push(d)))
  return stream
}

const reporter = () => {
  const formatStream = format()

  const synopsisStream = synopsis()

  // this also needs TAP from stdin
  const formSynopsisStream = formSynopsis()
    .pipe(through((push, synopsis, enc, cb) => {
      if (synopsis.failed.length) {
        process.on('exit', () => process.exit(1))
      }
      cb()
    }))

  const reporterStream = foo(formatStream, synopsisStream)

  reporterStream.push('\n') // start with a blank line
  formatStream.on('end', () => reporterStream.push('\n')) // blank line after formatted TAP
  synopsisStream.on('end', () => reporterStream.push('\n')) // blank line after summary

  return reporterStream
}

process.stdin
  .pipe(tapeUnsummarize())
  .pipe(reporter())
  .pipe(process.stdout)
