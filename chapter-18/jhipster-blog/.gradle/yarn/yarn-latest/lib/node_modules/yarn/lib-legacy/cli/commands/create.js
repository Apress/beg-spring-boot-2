'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = undefined;

var _toArray2;

function _load_toArray() {
  return _toArray2 = _interopRequireDefault(require('babel-runtime/helpers/toArray'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let run = exports.run = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    var _args = (0, (_toArray2 || _load_toArray()).default)(args);

    const builderName = _args[0],
          rest = _args.slice(1);

    if (!builderName) {
      throw new (_errors || _load_errors()).MessageError(reporter.lang('invalidPackageName'));
    }

    const packageName = builderName.replace(/^(@[^\/]+\/)?/, '$1create-');
    const commandName = packageName.replace(/^@[^\/]+\//, '');

    yield (0, (_global || _load_global()).run)(config, reporter, {}, ['add', packageName]);

    for (const registry of (_index || _load_index()).registryNames) {
      const packagePath = `${config.globalFolder}/${config.registries[registry].folder}/${packageName}`;

      if (!(yield (_fs || _load_fs()).exists(packagePath))) {
        continue;
      }

      const manifest = yield config.tryManifest(packagePath, registry, false);

      if (!manifest || !manifest.bin) {
        continue;
      }

      let binPath;

      if (typeof manifest.bin === 'string') {
        binPath = (0, (_path || _load_path()).resolve)(packagePath, manifest.bin);
      } else if (typeof manifest.bin === 'object' && manifest.bin[commandName]) {
        binPath = (0, (_path || _load_path()).resolve)(packagePath, manifest.bin[commandName]);
      } else {
        throw new (_errors || _load_errors()).MessageError(reporter.lang('createInvalidBin', packageName));
      }

      yield (_child || _load_child()).spawn(binPath, rest, { stdio: `inherit` });
      return;
    }

    throw new (_errors || _load_errors()).MessageError(reporter.lang('createMissingPackage'));
  });

  return function run(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

exports.setFlags = setFlags;
exports.hasWrapper = hasWrapper;

var _path;

function _load_path() {
  return _path = require('path');
}

var _errors;

function _load_errors() {
  return _errors = require('../../errors.js');
}

var _index;

function _load_index() {
  return _index = require('../../registries/index.js');
}

var _child;

function _load_child() {
  return _child = _interopRequireWildcard(require('../../util/child.js'));
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

var _global;

function _load_global() {
  return _global = require('./global.js');
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setFlags() {}

function hasWrapper() {
  return true;
}