var hypergraph = require('hyper-graph-db')

var db = hypergraph('./test1-db', { valueEncoding: 'utf-8' })

var triple = { subject: 'a', predicate: 'b', object: 'c' }

db.put(triple, function (err) {
  if (err) throw err
  db.get({ subject: 'a' }, function(err, list) {
    console.log(list)
  });
})
