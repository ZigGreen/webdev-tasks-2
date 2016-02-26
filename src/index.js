import * as M from './multivarka';

const reqDescriptor = M.multivarka(
  M.server('mongodb://localhost:27017/test'),
  M.collection('abc'),
  M.where('a'),
  M.not(),
  M.lessThan(3),
  M.greatThan(8),
  M.where('b'),
  M.include(['e', 't']),
  M.find(function (x, y) {
    x, y;
  })
);
