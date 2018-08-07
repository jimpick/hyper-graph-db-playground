const hypergraph = require('hyper-graph-db')
const N3 = require('n3')

const db = hypergraph('./test2-db', {
  valueEncoding: 'utf-8',
  prefixes: {
    cartoons: 'http://example.org/cartoons#'
  }
})

const parser = new N3.Parser();
parser.parse(
  `PREFIX c: <http://example.org/cartoons#>
   c:Tom a c:Cat.
   c:Jerry a c:Mouse;
           c:smarterThan c:Tom.`,
  (error, quad, prefixes) => {
    if (quad) {
      console.log(quad)
      const triple = {
        subject: quad.subject.value,
        predicate: quad.predicate.value,
        object: quad.object.value
      }
      console.log(triple)
      db.put(triple, err => {
        if (err) throw err
        db.get({ subject: 'cartoons:Jerry' }, function(err, list) {
          console.log(list)
        });
      })
    } else {
      console.log("# That's all, folks!", prefixes)
    }
  }
)

/*
var triple = { subject: 'a', predicate: 'b', object: 'c' }

db.put(triple, function (err) {
  if (err) throw err
  db.get({ subject: 'a' }, function(err, list) {
    console.log(list)
  });
})
*/
