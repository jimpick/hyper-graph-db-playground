const fs = require('fs')
const dps = require('dbpedia-sparql-client').default
const N3 = require('n3')

const { DataFactory } = N3
const { namedNode, literal, defaultGraph, quad } = DataFactory

async function run () {
  const showResources = fs.readFileSync('./data/shows.txt', 'utf8').split('\n')
  /*
  const showResources = [
    'http://dbpedia.org/resource/The_X-Files',
    'http://dbpedia.org/resource/2020_(mini-series)'
  ]
  */
  const showsQuery = `
    DESCRIBE
    ${showResources.map(show => `<${show}>`).join('\n')
  }`

  const showQuads = await dps.client().query(showsQuery).asJson()
    .then(r => r.results.bindings.map(binding => quad(
        convert(binding.s),
        convert(binding.p),
        convert(binding.o),
        defaultGraph()
      )
    ))
    .catch(e => console.error('Error', e))

  const writer = N3.Writer()
  showQuads.forEach(quad => writer.addQuad(quad))
  writer.end((err, result) => {
    if (err) throw err
    fs.writeFileSync('./data/vancouverShows.ttl', result)
    console.log('Done.')
    // console.log(result)
  })
  /*
  shows.length = 2
  shows.forEach(console.log)
  */
}

run()

function convert (component) {
  const {type, value, lang} = component
  if (type === 'uri') return namedNode(value)
  if (type === 'literal') { return literal(value, lang) }
  throw new Error('Unknown component content')
}
