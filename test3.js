const fs = require('fs')
const path = require('path')
const hypergraph = require('hyper-graph-db')
const N3 = require('n3')
const through2 = require('through2')

function importTurtleFile (graph, file, callback) {
  var parser = N3.StreamParser()
  var writer = graph.putStream()
  N3.Parser._resetBlankNodeIds()
  fs.createReadStream(file).pipe(parser).pipe(through2.obj(toTriple)).pipe(writer)
  // fs.createReadStream(file).pipe(parser).pipe(writer)
  writer.on('end', callback)
  writer.on('error', callback)
}

function toTriple (quad, enc, cb) {
  // console.log('Jim', quad)
  const triple = {
    subject: quad.subject.value,
    predicate: quad.predicate.value,
    object: quad.object.value
  }
  this.push(triple)
  cb()
}

const graph = hypergraph('./test3-db', {
  valueEncoding: 'utf-8'
})

graph.on('ready', () => {
  importTurtleFile(graph, path.join(__dirname, './data/vancouver.ttl'), err => {
    if (err) throw err
    console.log('Done.')
    graph.get({}, function(err, list) {
      console.log(list)
    });
  })
})


/*
var triple = { subject: 'a', predicate: 'b', object: 'c' }

db.put(triple, function (err) {
  if (err) throw err
  db.get({ subject: 'a' }, function(err, list) {
    console.log(list)
  });
})
*/
