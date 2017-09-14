'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRootUser = isRootUser;
function getUid() {
  if (process.platform !== 'win32' && process.getuid) {
    return process.getuid();
  }
  return null;
}

exports.default = isRootUser(getUid());
function isRootUser(uid) {
  return uid === 0;
}