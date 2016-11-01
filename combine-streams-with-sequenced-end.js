const through = require('throo')

const combineStreams = (...streams) => {
  const stream = through.obj((push, chunk, enc, cb) => {
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

module.exports = combineStreams
