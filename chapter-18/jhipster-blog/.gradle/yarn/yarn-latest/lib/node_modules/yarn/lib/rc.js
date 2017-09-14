'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRcConf = getRcConf;
exports.getRcArgs = getRcArgs;
exports.clearRcCache = clearRcCache;

var _path;

function _load_path() {
  return _path = require('path');
}

var _parse;

function _load_parse() {
  return _parse = _interopRequireDefault(require('./lockfile/parse.js'));
}

var _rc;

function _load_rc() {
  return _rc = _interopRequireWildcard(require('./util/rc.js'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Keys that will get resolved relative to the path of the rc file they belong to
const PATH_KEYS = ['cache-folder', 'global-folder', 'modules-folder'];

let rcConfCache;
let rcArgsCache;

const buildRcConf = () => (_rc || _load_rc()).findRc('yarn', (fileText, filePath) => {
  const values = (0, (_parse || _load_parse()).default)(fileText, 'yarnrc');
  const keys = Object.keys(values);

  for (const key of keys) {
    for (const pathKey of PATH_KEYS) {
      if (key.replace(/^(--)?([^.]+\.)*/, '') === pathKey) {
        values[key] = (0, (_path || _load_path()).resolve)((0, (_path || _load_path()).dirname)(filePath), values[key]);
      }
    }
  }

  return values;
});

function getRcConf() {
  if (!rcConfCache) {
    rcConfCache = buildRcConf();
  }

  return rcConfCache;
}

const buildRcArgs = () => Object.keys(getRcConf()).reduce((argLists, key) => {
  const miniparse = key.match(/^--(?:([^.]+)\.)?(.*)$/);

  if (!miniparse) {
    return argLists;
  }

  const namespace = miniparse[1] || '*';
  const arg = miniparse[2];
  const value = getRcConf()[key];

  if (!argLists[namespace]) {
    argLists[namespace] = [];
  }

  if (typeof value === 'string') {
    argLists[namespace] = argLists[namespace].concat([`--${arg}`, value]);
  } else if (value === true) {
    argLists[namespace] = argLists[namespace].concat([`--${arg}`]);
  } else if (value === false) {
    argLists[namespace] = argLists[namespace].concat([`--no-${arg}`]);
  }

  return argLists;
}, {});

function getRcArgs(command) {
  if (!rcArgsCache) {
    rcArgsCache = buildRcArgs();
  }

  let result = rcArgsCache['*'] || [];

  if (command !== '*' && Object.prototype.hasOwnProperty.call(rcArgsCache, command)) {
    result = result.concat(rcArgsCache[command] || []);
  }

  return result;
}

function clearRcCache() {
  rcConfCache = null;
  rcArgsCache = null;
}