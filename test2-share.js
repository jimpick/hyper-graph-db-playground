var hyperdiscovery = require('hyperdiscovery')
var hypergraph = require('hyper-graph-db')

var db = hypergraph('./test2-db', { valueEncoding: 'utf-8' })

db.on('ready', () => {
  console.log('Key:', db.db.key.toString('hex'))
  const sw = hyperdiscovery(db.db)

  sw.on('connection', function (peer, type) {
    // console.log('got', peer, type) 
    console.log('connected to', sw.connections.length, 'peers')
    peer.on('close', function () {
      console.log('peer disconnected')
    })
  })
})
