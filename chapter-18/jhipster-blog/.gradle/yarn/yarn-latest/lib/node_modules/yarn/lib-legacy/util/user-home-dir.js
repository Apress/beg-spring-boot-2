'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rootUser;

function _load_rootUser() {
  return _rootUser = _interopRequireDefault(require('./root-user.js'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const path = require('path');

const userHomeDir = process.platform === 'linux' && (_rootUser || _load_rootUser()).default ? path.resolve('/usr/local/share') : require('os').homedir();

exports.default = userHomeDir;