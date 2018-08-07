const fs = require('fs')
const hyperdiscovery = require('hyperdiscovery')
const hypergraph = require('hyper-graph-db')
const ram = require('random-access-memory')
const {green, red} = require('chalk')

const key = fs.readFileSync('./test4-db/source/key')
// console.log('Key:', key.toString('hex'))

const db = hypergraph(ram, key, { valueEncoding: 'utf-8' })

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

    /*
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
    */

    db.query(`
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbr: <http://dbpedia.org/resource/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      select ?s ?releaseDate ?completionDate
      WHERE {
        ?s rdf:type dbo:TelevisionShow .
        ?s dbo:location dbr:Vancouver .
        ?s dbo:releaseDate ?releaseDate .
        ?s dbo:completionDate ?completionDate .
      }
    `, (err, list) => {
      if (err) throw err
      const allShows = list.map(showData => {
        // console.log(showData)
        let {
          ['?s']: showTitle,
          ['?releaseDate']: releaseDate,
          ['?completionDate']: completionDate
        } = showData
        showTitle = showTitle.replace('http://dbpedia.org/resource/', '')
        releaseDate = new Date(releaseDate)
        completionDate = new Date(completionDate)
        return {showTitle, releaseDate, completionDate}
      })
      allShows
        .sort((a, b) => a.releaseDate - b.releaseDate)
        .forEach(({showTitle, releaseDate, completionDate}) => {
          console.log(
            showTitle.slice(0, 60).padEnd(60),
            green(releaseDate.toISOString().split('T')[0]),
            red(completionDate.toISOString().split('T')[0])
          )
        })
      process.exit(0)
    })
  })
})

