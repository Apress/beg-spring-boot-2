'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const invariant = require('invariant');
const stream = require('stream');

class ConcatStream extends stream.Transform {
  constructor(done) {
    super();
    this._data = [];
    this._done = done;
  }

  _transform(chunk, encoding, callback) {
    invariant(chunk instanceof Buffer, 'Chunk must be a buffer');
    invariant(this._data != null, 'Missing data array');
    this._data.push(chunk);
    this.push(chunk);
    callback();
  }

  _flush(callback) {
    invariant(this._data != null, 'Missing data array');
    this._done(Buffer.concat(this._data));
    this._data = null;
    callback();
  }
}
exports.ConcatStream = ConcatStream;