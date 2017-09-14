'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = undefined;

var _assign;

function _load_assign() {
  return _assign = _interopRequireDefault(require('babel-runtime/core-js/object/assign'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let run = exports.run = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    const versions = { yarn: (_yarnVersion || _load_yarnVersion()).version };

    const pkg = yield config.maybeReadManifest(config.cwd);
    if (pkg && pkg.name && pkg.version) {
      versions[pkg.name] = pkg.version;
    }

    (0, (_assign || _load_assign()).default)(versions, process.versions);

    reporter.inspect(versions);
  });

  return function run(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

exports.setFlags = setFlags;
exports.hasWrapper = hasWrapper;

var _yarnVersion;

function _load_yarnVersion() {
  return _yarnVersion = require('../../util/yarn-version.js');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setFlags() {}

function hasWrapper() {
  return true;
}