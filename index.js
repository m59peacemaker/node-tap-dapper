const format = require('tap-vibrant')
const synopsis = require('tap-synopsis')
const combineStreams = require('./combine-streams-with-sequenced-end')

const reporter = () => {
  const formatStream = format()
  const synopsisStream = synopsis()
  const reporterStream = combineStreams(formatStream, synopsisStream)

  reporterStream.push('\n') // start with a blank line
  formatStream.on('end', () => reporterStream.push('\n')) // blank line after formatted TAP
  synopsisStream.on('end', () => reporterStream.push('\n')) // blank line after summary

  return reporterStream
}

module.exports = reporter
