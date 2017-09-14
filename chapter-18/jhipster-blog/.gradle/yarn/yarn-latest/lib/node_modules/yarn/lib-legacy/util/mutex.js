"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));
}

var _map;

function _load_map() {
  return _map = _interopRequireDefault(require("babel-runtime/core-js/map"));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const lockPromises = new (_map || _load_map()).default();

/**
 * Acquires a mutex lock over the given key. If the lock can't be acquired, it waits until it's available.
 * @param key Key to get the lock for.
 * @return {Promise.<Function>} A Promise that resolves when the lock is acquired, with the function that
 * must be called to release the lock.
 */

exports.default = key => {
  let unlockNext;
  const willLock = new (_promise || _load_promise()).default(resolve => unlockNext = resolve);
  const lockPromise = lockPromises.get(key) || (_promise || _load_promise()).default.resolve();
  const willUnlock = lockPromise.then(() => unlockNext);
  lockPromises.set(key, lockPromise.then(() => willLock));
  return willUnlock;
};