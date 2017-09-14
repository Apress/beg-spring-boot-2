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
    const deps = yield (_packageRequest || _load_packageRequest()).default.getOutdatedPackages(lockfile, install, config, reporter);

    if (!deps.length) {
      reporter.success(reporter.lang('allDependenciesUpToDate'));
      return;
    }

    const getNameFromHint = function (hint) {
      return hint ? `${hint}Dependencies` : 'dependencies';
    };

    const maxLengthArr = { name: 0, current: 0, latest: 0 };
    deps.forEach(function (dep) {
      return ['name', 'current', 'latest'].forEach(function (key) {
        maxLengthArr[key] = Math.max(maxLengthArr[key], dep[key].length);
      });
    });

    // Depends on maxLengthArr
    const addPadding = function (dep) {
      return function (key) {
        return `${dep[key]}${' '.repeat(maxLengthArr[key] - dep[key].length)}`;
      };
    };

    const colorizeName = function (_ref2) {
      let current = _ref2.current,
          wanted = _ref2.wanted;
      return current === wanted ? reporter.format.yellow : reporter.format.red;
    };

    const colorizeDiff = function (from, to) {
      const parts = to.split('.');
      const fromParts = from.split('.');

      const index = parts.findIndex(function (part, i) {
        return part !== fromParts[i];
      });
      const splitIndex = index >= 0 ? index : parts.length;

      const colorized = reporter.format.green(parts.slice(splitIndex).join('.'));
      return parts.slice(0, splitIndex).concat(colorized).join('.');
    };

    const makeRow = function (dep) {
      const padding = addPadding(dep);
      const name = colorizeName(dep)(padding('name'));
      const current = reporter.format.blue(padding('current'));
      const latest = colorizeDiff(dep.current, padding('latest'));
      const url = reporter.format.cyan(dep.url);
      return `${name}  ${current}  ❯  ${latest}  ${url}`;
    };

    const groupedDeps = deps.reduce(function (acc, dep) {
      const hint = dep.hint,
            name = dep.name,
            latest = dep.latest;

      const key = getNameFromHint(hint);
      const xs = acc[key] || [];
      acc[key] = xs.concat({
        name: makeRow(dep),
        value: dep,
        short: `${name}@${latest}`
      });
      return acc;
    }, {});

    const flatten = function (xs) {
      return xs.reduce(function (ys, y) {
        return ys.concat(Array.isArray(y) ? flatten(y) : y);
      }, []);
    };

    const choices = flatten(Object.keys(groupedDeps).map(function (key) {
      return [new (_inquirer || _load_inquirer()).default.Separator(reporter.format.bold.underline.green(key)), groupedDeps[key], new (_inquirer || _load_inquirer()).default.Separator(' ')];
    }));

    try {
      const answers = yield reporter.prompt('Choose which packages to update.', choices, {
        name: 'packages',
        type: 'checkbox',
        validate: function (answer) {
          return !!answer.length || 'You must choose at least one package.';
        }
      });

      const getName = function (_ref3) {
        let name = _ref3.name;
        return name;
      };
      const isHint = function (x) {
        return function (_ref4) {
          let hint = _ref4.hint;
          return hint === x;
        };
      };

      yield [null, 'dev', 'optional', 'peer'].reduce((() => {
        var _ref5 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (promise, hint) {
          // Wait for previous promise to resolve
          yield promise;
          // Reset dependency flags
          flags.dev = hint === 'dev';
          flags.peer = hint === 'peer';
          flags.optional = hint === 'optional';

          const deps = answers.filter(isHint(hint)).map(getName);
          if (deps.length) {
            reporter.info(reporter.lang('updateInstalling', getNameFromHint(hint)));
            const add = new (_add || _load_add()).Add(deps, flags, config, reporter, lockfile);
            return yield add.init();
          }
          return Promise.resolve();
        });

        return function (_x5, _x6) {
          return _ref5.apply(this, arguments);
        };
      })(), Promise.resolve());
    } catch (e) {
      Promise.reject(e);
    }
  });

  return function run(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

exports.setFlags = setFlags;
exports.hasWrapper = hasWrapper;

var _inquirer;

function _load_inquirer() {
  return _inquirer = _interopRequireDefault(require('inquirer'));
}

var _packageRequest;

function _load_packageRequest() {
  return _packageRequest = _interopRequireDefault(require('../../package-request.js'));
}

var _add;

function _load_add() {
  return _add = require('./add.js');
}

var _install;

function _load_install() {
  return _install = require('./install.js');
}

var _wrapper;

function _load_wrapper() {
  return _wrapper = _interopRequireDefault(require('../../lockfile/wrapper.js'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const requireLockfile = exports.requireLockfile = true;

function setFlags(commander) {
  commander.usage('upgrade-interactive');
  commander.option('-E, --exact', 'install exact version');
  commander.option('-T, --tilde', 'install most recent release with the same minor version');
}

function hasWrapper() {
  return true;
}