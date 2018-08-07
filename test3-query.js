var fs = require('fs')
var hyperdiscovery = require('hyperdiscovery')
var hypergraph = require('hyper-graph-db')
var ram = require('random-access-memory')

var key = fs.readFileSync('./test3-db/source/key')
// console.log('Key:', key.toString('hex'))

var db = hypergraph(ram, key, { valueEncoding: 'utf-8' })

db.db.on('ready', () => {
  console.log('Key:', db.db.key.toString('hex'))
  const sw = hyperdiscovery(db.db, {sparse: true})

  sw.on('connection', function (peer, type) {
    // console.log('got', peer, type) 
    console.log('connected to', sw.connections.length, 'peers')
    peer.on('close', function () {
      console.log('peer disconnected')
    })
  })
  db.db.on('append', () => {
    console.log('Append')

    /*
    db.get({
      subject: 'http://dbpedia.org/resource/Vancouver',
      predicate: 'http://dbpedia.org/ontology/populationMetro',
      //object: '2313328'
    }, function(err, list) {
      console.log(list)
    });
    */

    /*
    db.get({
      predicate: 'http://dbpedia.org/ontology/location',
      object: 'http://dbpedia.org/resource/Vancouver'
    }, function(err, list) {
      console.log(list)
    });
    */

    db.query(`
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbr: <http://dbpedia.org/resource/>
      SELECT ?pop
      WHERE { dbr:Vancouver dbo:populationMetro ?pop }
    `, (err, list) => {
      if (err) throw err
      console.log(list)
      process.exit(0)
    })
  })
})

