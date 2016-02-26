import * as M from './multivarka';

M.multivarka(
  M.server('mongodb://localhost:27017/test'),
  M.collection('abc'),
  M.find(::console.log)
);

const reqDescriptor = M.multivarka(
  M.server('mongodb://localhost:27017/test'),
  M.collection('abc'),
  M.insert({a: 999, b: 't'}, () => {
    M.multivarka(
      M.server('mongodb://localhost:27017/test'),
      M.collection('abc'),
      M.where('a'),
      M.greatThan(666),
      M.find(::console.log)
    );
  })
);

M.multivarka(
  M.server('mongodb://localhost:27017/test'),
  M.collection('abc'),
  M.where('a'),
  M.not(),
  M.lessThan(3),
  M.greatThan(8),
  M.set('a', 7),
  M.update(::console.log)
);
