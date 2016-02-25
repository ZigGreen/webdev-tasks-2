var MongoClient = require('mongodb').MongoClient;
var R = require('ramda');
// Connection url
var url = 'mongodb://localhost:27017/test';
// Connect using MongoClient
MongoClient.connect(url, function(err, db) {
  // Use the admin database for the operation
  var adminDb = db.admin();
  // List all the available databases
  var col = db.collection('abc');
  // Show that duplicate records got dropped
  col.find({k: {$gt: 1}, a: {$in: ["f","g"]}, t: {$eq: "ololo1"}}).toArray(function(err, items) {

    db.close();
  });
});


var server = R.set(R.lensProp('serverURL'));

var collection = R.set(R.lensProp('collection'));

var where = R.useWith(R.over, [
  R.pipe(R.concat(['query']), R.lensPath),
  R.partial(R.pipe, [R.defaultTo({})]),
  R.identity
]);

var a = where('ololo', R.assoc("x",1), {});
void 0;
