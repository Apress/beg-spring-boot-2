'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.requireLockfile = undefined;

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let run = exports.run = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    const lockfile = yield (_wrapper || _load_wrapper()).default.fromDirectory(config.cwd);
    const install = new (_install || _load_install()).Install(flags, config, reporter, lockfile);
    let deps = yield (_packageRequest || _load_packageRequest()).default.getOutdatedPackages(lockfile, install, config, reporter);

    if (args.length) {
      const requested = new Set(args);

      deps = deps.filter(function (_ref2) {
        let name = _ref2.name;
        return requested.has(name);
      });
    }

    const getNameFromHint = function (hint) {
      return hint ? `${hint}Dependencies` : 'dependencies';
    };
    const getColorFromVersion = function (_ref3) {
      let current = _ref3.current,
          wanted = _ref3.wanted,
          name = _ref3.name;
      return current === wanted ? reporter.format.yellow(name) : reporter.format.red(name);
    };

    if (deps.length) {
      const body = deps.map(function (info) {
        return [getColorFromVersion(info), info.current, reporter.format.green(info.wanted), reporter.format.magenta(info.latest), getNameFromHint(info.hint), reporter.format.cyan(info.url)];
      });

      reporter.table(['Package', 'Current', 'Wanted', 'Latest', 'Package Type', 'URL'], body);
    }

    return Promise.resolve();
  });

  return function run(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

exports.setFlags = setFlags;
exports.hasWrapper = hasWrapper;

var _packageRequest;

function _load_packageRequest() {
  return _packageRequest = _interopRequireDefault(require('../../package-request.js'));
}

var _wrapper;

function _load_wrapper() {
  return _wrapper = _interopRequireDefault(require('../../lockfile/wrapper.js'));
}

var _install;

function _load_install() {
  return _install = require('./install.js');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const requireLockfile = exports.requireLockfile = true;

function setFlags(commander) {
  commander.usage('outdated [packages ...]');
}

function hasWrapper() {
  return true;
}