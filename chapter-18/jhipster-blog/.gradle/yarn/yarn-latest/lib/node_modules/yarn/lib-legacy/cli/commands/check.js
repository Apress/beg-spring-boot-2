'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.verifyTreeCheck = exports.noArguments = exports.requireLockfile = undefined;

var _assign;

function _load_assign() {
  return _assign = _interopRequireDefault(require('babel-runtime/core-js/object/assign'));
}

var _slicedToArray2;

function _load_slicedToArray() {
  return _slicedToArray2 = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray'));
}

var _set;

function _load_set() {
  return _set = _interopRequireDefault(require('babel-runtime/core-js/set'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let verifyTreeCheck = exports.verifyTreeCheck = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    let errCount = 0;
    function reportError(msg) {
      for (var _len = arguments.length, vars = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        vars[_key - 1] = arguments[_key];
      }

      reporter.error(reporter.lang.apply(reporter, [msg].concat(vars)));
      errCount++;
    }
    // check all dependencies recursively without relying on internal resolver
    const registryName = 'yarn';
    const registry = config.registries[registryName];
    const rootManifest = yield config.readManifest(registry.cwd, registryName);

    const dependenciesToCheckVersion = [];
    if (rootManifest.dependencies) {
      for (const name in rootManifest.dependencies) {
        dependenciesToCheckVersion.push({
          name: name,
          originalKey: name,
          parentCwd: registry.cwd,
          version: rootManifest.dependencies[name]
        });
      }
    }
    if (rootManifest.devDependencies && !config.production) {
      for (const name in rootManifest.devDependencies) {
        dependenciesToCheckVersion.push({
          name: name,
          originalKey: name,
          parentCwd: registry.cwd,
          version: rootManifest.devDependencies[name]
        });
      }
    }

    const locationsVisited = new (_set || _load_set()).default();
    while (dependenciesToCheckVersion.length) {
      const dep = dependenciesToCheckVersion.shift();
      const manifestLoc = path.join(dep.parentCwd, registry.folder, dep.name);
      if (locationsVisited.has(manifestLoc + `@${dep.version}`)) {
        continue;
      }
      locationsVisited.add(manifestLoc + `@${dep.version}`);
      if (!(yield (_fs || _load_fs()).exists(manifestLoc))) {
        reportError('packageNotInstalled', `${dep.originalKey}`);
        continue;
      }
      const pkg = yield config.readManifest(manifestLoc, registryName);
      if (semver.validRange(dep.version, config.looseSemver) && !semver.satisfies(pkg.version, dep.version, config.looseSemver)) {
        reportError('packageWrongVersion', dep.originalKey, dep.version, pkg.version);
        continue;
      }
      const dependencies = pkg.dependencies;
      if (dependencies) {
        for (const subdep in dependencies) {
          const subDepPath = path.join(manifestLoc, registry.folder, subdep);
          let found = false;
          const relative = path.relative(registry.cwd, subDepPath);
          const locations = path.normalize(relative).split(registry.folder + path.sep).filter(function (dir) {
            return !!dir;
          });
          locations.pop();
          while (locations.length >= 0) {
            let possiblePath;
            if (locations.length > 0) {
              possiblePath = path.join(registry.cwd, registry.folder, locations.join(path.sep + registry.folder + path.sep));
            } else {
              possiblePath = registry.cwd;
            }
            if (yield (_fs || _load_fs()).exists(path.join(possiblePath, registry.folder, subdep))) {
              dependenciesToCheckVersion.push({
                name: subdep,
                originalKey: `${dep.originalKey}#${subdep}`,
                parentCwd: possiblePath,
                version: dependencies[subdep]
              });
              found = true;
              break;
            }
            if (!locations.length) {
              break;
            }
            locations.pop();
          }
          if (!found) {
            reportError('packageNotInstalled', `${dep.originalKey}#${subdep}`);
          }
        }
      }
    }

    if (errCount > 0) {
      throw new (_errors || _load_errors()).MessageError(reporter.lang('foundErrors', errCount));
    } else {
      reporter.success(reporter.lang('folderInSync'));
    }
  });

  return function verifyTreeCheck(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

let integrityHashCheck = (() => {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    let errCount = 0;
    function reportError(msg) {
      for (var _len2 = arguments.length, vars = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        vars[_key2 - 1] = arguments[_key2];
      }

      reporter.error(reporter.lang.apply(reporter, [msg].concat(vars)));
      errCount++;
    }
    const integrityChecker = new (_integrityChecker || _load_integrityChecker()).default(config);

    const lockfile = yield (_wrapper || _load_wrapper()).default.fromDirectory(config.cwd);
    const install = new (_install || _load_install()).Install(flags, config, reporter, lockfile);

    // get patterns that are installed when running `yarn install`

    var _ref3 = yield install.fetchRequestFromCwd();

    const patterns = _ref3.patterns;


    const match = yield integrityChecker.check(patterns, lockfile.cache, flags);
    for (const pattern of match.missingPatterns) {
      reportError('lockfileNotContainPattern', pattern);
    }
    if (match.integrityFileMissing) {
      reportError('noIntegrityFile');
    }
    if (match.integrityMatches === false) {
      reporter.warn(reporter.lang((_integrityChecker2 || _load_integrityChecker2()).integrityErrors[match.integrityError]));
      reportError('integrityCheckFailed');
    }

    if (errCount > 0) {
      throw new (_errors || _load_errors()).MessageError(reporter.lang('foundErrors', errCount));
    } else {
      reporter.success(reporter.lang('folderInSync'));
    }
  });

  return function integrityHashCheck(_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
})();

let run = exports.run = (() => {
  var _ref4 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    if (flags.verifyTree) {
      yield verifyTreeCheck(config, reporter, flags, args);
      return;
    } else if (flags.integrity) {
      yield integrityHashCheck(config, reporter, flags, args);
      return;
    }

    const lockfile = yield (_wrapper || _load_wrapper()).default.fromDirectory(config.cwd);
    const install = new (_install || _load_install()).Install(flags, config, reporter, lockfile);

    function humaniseLocation(loc) {
      const relative = path.relative(path.join(config.cwd, 'node_modules'), loc);
      const normalized = path.normalize(relative).split(path.sep);
      return normalized.filter(p => p !== 'node_modules').reduce((result, part) => {
        const length = result.length;
        if (length && result[length - 1].startsWith('@') && !result[length - 1].includes(path.sep)) {
          result[length - 1] += path.sep + part;
        } else {
          result.push(part);
        }
        return result;
      }, []);
    }

    let warningCount = 0;
    let errCount = 0;
    function reportError(msg) {
      for (var _len3 = arguments.length, vars = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        vars[_key3 - 1] = arguments[_key3];
      }

      reporter.error(reporter.lang.apply(reporter, [msg].concat(vars)));
      errCount++;
    }

    // get patterns that are installed when running `yarn install`

    var _ref5 = yield install.hydrate(true);

    const rawPatterns = _ref5.patterns;

    const patterns = yield install.flatten(rawPatterns);

    // check if patterns exist in lockfile
    for (const pattern of patterns) {
      if (!lockfile.getLocked(pattern)) {
        reportError('lockfileNotContainPattern', pattern);
      }
    }

    // check if any of the node_modules are out of sync
    const res = yield install.linker.getFlatHoistedTree(patterns);
    for (const _ref6 of res) {
      var _ref7 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref6, 2);

      const loc = _ref7[0];
      var _ref7$ = _ref7[1];
      const originalKey = _ref7$.originalKey;
      const pkg = _ref7$.pkg;
      const ignore = _ref7$.ignore;

      if (ignore) {
        continue;
      }

      const parts = humaniseLocation(loc);

      // grey out hoisted portions of key
      let human = originalKey;
      const hoistedParts = parts.slice();
      const hoistedKey = parts.join('#');
      if (human !== hoistedKey) {
        const humanParts = human.split('#');

        for (let i = 0; i < humanParts.length; i++) {
          const humanPart = humanParts[i];

          if (hoistedParts[0] === humanPart) {
            hoistedParts.shift();

            if (i < humanParts.length - 1) {
              humanParts[i] += '#';
            }
          } else {
            humanParts[i] = reporter.format.dim(`${humanPart}#`);
          }
        }

        human = humanParts.join('');
      }

      const pkgLoc = path.join(loc, 'package.json');
      if (!(yield (_fs || _load_fs()).exists(loc)) || !(yield (_fs || _load_fs()).exists(pkgLoc))) {
        if (pkg._reference.optional) {
          reporter.warn(reporter.lang('optionalDepNotInstalled', human));
        } else {
          reportError('packageNotInstalled', human);
        }
        continue;
      }

      const packageJson = yield config.readJson(pkgLoc);
      if (pkg.version !== packageJson.version) {
        // node_modules contains wrong version
        reportError('packageWrongVersion', human, pkg.version, packageJson.version);
      }

      const deps = (0, (_assign || _load_assign()).default)({}, packageJson.dependencies, packageJson.peerDependencies);

      for (const name in deps) {
        const range = deps[name];
        if (!semver.validRange(range, config.looseSemver)) {
          continue; // exotic
        }

        const subHuman = `${human}#${name}@${range}`;

        // find the package that this will resolve to, factoring in hoisting
        const possibles = [];
        let depPkgLoc;
        for (let i = parts.length; i >= 0; i--) {
          const myParts = parts.slice(0, i).concat(name);

          // build package.json location for this position
          const myDepPkgLoc = path.join(config.cwd, 'node_modules', myParts.join(`${path.sep}node_modules${path.sep}`), 'package.json');

          possibles.push(myDepPkgLoc);
        }
        while (possibles.length) {
          const myDepPkgLoc = possibles.shift();
          if (yield (_fs || _load_fs()).exists(myDepPkgLoc)) {
            depPkgLoc = myDepPkgLoc;
            break;
          }
        }
        if (!depPkgLoc) {
          // we'll hit the module not install error above when this module is hit
          continue;
        }

        //
        const depPkg = yield config.readJson(depPkgLoc);
        const foundHuman = `${humaniseLocation(path.dirname(depPkgLoc)).join('#')}@${depPkg.version}`;
        if (!semver.satisfies(depPkg.version, range, config.looseSemver)) {
          // module isn't correct semver
          reportError('packageDontSatisfy', subHuman, foundHuman);
          continue;
        }

        // check for modules above us that this could be deduped to
        for (const loc of possibles) {
          if (!(yield (_fs || _load_fs()).exists(loc))) {
            continue;
          }

          const packageJson = yield config.readJson(loc);
          if (packageJson.version === depPkg.version || semver.satisfies(packageJson.version, range, config.looseSemver) && semver.gt(packageJson.version, depPkg.version, config.looseSemver)) {
            reporter.warn(reporter.lang('couldBeDeduped', subHuman, packageJson.version, `${humaniseLocation(path.dirname(loc)).join('#')}@${packageJson.version}`));
            warningCount++;
          }
          break;
        }
      }
    }

    if (warningCount > 1) {
      reporter.info(reporter.lang('foundWarnings', warningCount));
    }

    if (errCount > 0) {
      throw new (_errors || _load_errors()).MessageError(reporter.lang('foundErrors', errCount));
    } else {
      reporter.success(reporter.lang('folderInSync'));
    }
  });

  return function run(_x9, _x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
})();

exports.hasWrapper = hasWrapper;
exports.setFlags = setFlags;

var _errors;

function _load_errors() {
  return _errors = require('../../errors.js');
}

var _integrityChecker;

function _load_integrityChecker() {
  return _integrityChecker = _interopRequireDefault(require('../../integrity-checker.js'));
}

var _integrityChecker2;

function _load_integrityChecker2() {
  return _integrityChecker2 = require('../../integrity-checker.js');
}

var _wrapper;

function _load_wrapper() {
  return _wrapper = _interopRequireDefault(require('../../lockfile/wrapper.js'));
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

var _install;

function _load_install() {
  return _install = require('./install.js');
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const semver = require('semver');

const path = require('path');

const requireLockfile = exports.requireLockfile = false;
const noArguments = exports.noArguments = true;

function hasWrapper() {
  return true;
}

function setFlags(commander) {
  commander.option('--integrity');
  commander.option('--verify-tree');
}