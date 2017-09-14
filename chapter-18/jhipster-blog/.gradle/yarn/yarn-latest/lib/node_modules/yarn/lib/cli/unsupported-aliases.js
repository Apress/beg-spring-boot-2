'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2;

function _load_extends() {
  return _extends2 = _interopRequireDefault(require('babel-runtime/helpers/extends'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const shorthands = {
  c: 'config',
  i: 'install',
  la: 'list',
  ll: 'list',
  ln: 'link',
  ls: 'list',
  r: 'remove',
  rb: 'rebuild',
  rm: 'remove',
  t: 'test',
  tst: 'test',
  un: 'remove',
  up: 'upgrade',
  v: 'version'
};

const affordances = {
  'add-user': 'login',
  adduser: 'login',
  author: 'owner',
  'dist-tag': 'tag',
  'dist-tags': 'tag',
  isntall: 'install',
  'run-script': 'run',
  runScript: 'run',
  show: 'info',
  uninstall: 'remove',
  update: 'upgrade',
  verison: 'version',
  view: 'info'
};

exports.default = (0, (_extends2 || _load_extends()).default)({}, shorthands, affordances);