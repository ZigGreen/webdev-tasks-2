import {MongoClient} from 'mongodb';
import {
  lensProp, defaultTo, pipe, lensPath, concat, identity, over, useWith, ifElse,
  is, pair, lensIndex, partial, compose, apply, assoc, objOf, flip, merge,
  toPairs, map, always, __, call, prepend, has, prop, tap, props, curryN,
  converge, when as RWhen, pathSatisfies, equals, omit
} from 'ramda';

const wrapCompose = fn => partial(compose, [fn]);

export const where = prop => apply(
  useWith(
    over(lensPath(['query', '$and'])),
    [
      pipe(flip(call)([]), map(objOf(prop)), concat),
      identity
    ])
);

const aside = fn => ifElse(
  is(Array),
  over(lensIndex(0), wrapCompose(fn)),
  pair(fn)
);

const wrapAside = wrapCompose(aside);

const createOperator = pipe(objOf, wrapCompose(prepend));

const $gt = createOperator('$gt');

const $lt = createOperator('$lt');

const $in = createOperator('$in');

const $not = ifElse(has('$not'), prop('$not'), objOf('$not'));

const $and = objOf('$and');

export const lessThan = wrapAside($lt);

export const greatThan = wrapAside($gt);

export const include = wrapAside($in);

export const not = wrapAside(always(map($not)));

export const server = assoc('serverURL');

export const collection = assoc('collection');

const action = type => pipe(
  objOf('callback'),
  assoc('type', type),
  flip(merge)
);

export const find = action('find');

export const remove = action('remove');

export const update = action('update');

export const insert = useWith(pipe, [assoc('query'), action('insertOne')])

export const set = pipe(assoc, over(lensProp('options')))
//export const update = pipe

const RequestType = {
  query     : {'$and': []},
  serverURL : 'mongodb://localhost:27017/test',
  collection: 'abc',
  callback  : identity,
  type      : 'find'
};

var startRequest = req =>
  MongoClient.connect(req.serverURL, (err, db) => {
    if (err) return req.callback(err);
    const reqParams = props(['query', 'options'], req);
    var res = db.collection(req.collection)[req.type](...reqParams);
    if (res.then) {
      res.then(req.callback);
    } else {
      res.toArray(req.callback);
    }
  });

export const multivarka = (...reqBuildChain) => compose(
  tap(startRequest),
  over(lensProp('query'), RWhen(
    pathSatisfies(equals(0), ['$and', 'length']),
    omit(['$and'])
  )),
  ...reqBuildChain
)(RequestType);
