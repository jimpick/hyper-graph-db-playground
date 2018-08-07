const fs = require('fs')
const dps = require('dbpedia-sparql-client').default

async function run () {
  const showsQuery = `
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dbo: <http://dbpedia.org/ontology/>

    select ?s
    WHERE {
      ?s rdf:type dbo:TelevisionShow .
      ?s dbo:location dbr:Vancouver
    }
  `

  const shows = await dps.client().query(showsQuery).asJson()
    .then(r => r.results.bindings.map(binding => binding.s.value))

  fs.writeFileSync('./data/shows.txt', shows.join('\n'))

  for (let show of shows) {
    console.log(show)
  }
}

run()
