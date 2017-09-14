'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.integrityErrors = undefined;

var _stringify;

function _load_stringify() {
  return _stringify = _interopRequireDefault(require('babel-runtime/core-js/json/stringify'));
}

var _assign;

function _load_assign() {
  return _assign = _interopRequireDefault(require('babel-runtime/core-js/object/assign'));
}

var _keys;

function _load_keys() {
  return _keys = _interopRequireDefault(require('babel-runtime/core-js/object/keys'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _constants;

function _load_constants() {
  return _constants = _interopRequireWildcard(require('./constants.js'));
}

var _index;

function _load_index() {
  return _index = require('./registries/index.js');
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('./util/fs.js'));
}

var _misc;

function _load_misc() {
  return _misc = require('./util/misc.js');
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const invariant = require('invariant');

const path = require('path');

const integrityErrors = exports.integrityErrors = {
  EXPECTED_IS_NOT_A_JSON: 'integrityFailedExpectedIsNotAJSON',
  FILES_MISSING: 'integrityFailedFilesMissing',
  LOCKFILE_DONT_MATCH: 'integrityLockfilesDontMatch',
  FLAGS_DONT_MATCH: 'integrityFlagsDontMatch',
  LINKED_MODULES_DONT_MATCH: 'integrityCheckLinkedModulesDontMatch'
};

/**
 *
 */
class InstallationIntegrityChecker {
  constructor(config) {
    this.config = config;
  }

  /**
   * Get the location of an existing integrity hash. If none exists then return the location where we should
   * write a new one.
   */

  _getIntegrityHashLocation(usedRegistries) {
    var _this = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      let locationFolder;

      if (_this.config.enableMetaFolder) {
        locationFolder = path.join(_this.config.cwd, (_constants || _load_constants()).META_FOLDER);
      } else {
        // build up possible folders
        let registries = (_index || _load_index()).registryNames;
        if (usedRegistries && usedRegistries.size > 0) {
          registries = usedRegistries;
        }
        const possibleFolders = [];
        if (_this.config.modulesFolder) {
          possibleFolders.push(_this.config.modulesFolder);
        }

        // ensure we only write to a registry folder that was used
        for (const name of registries) {
          const loc = path.join(_this.config.cwd, _this.config.registries[name].folder);
          possibleFolders.push(loc);
        }

        // if we already have an integrity hash in one of these folders then use it's location otherwise use the
        // first folder
        let loc;
        for (const possibleLoc of possibleFolders) {
          if (yield (_fs || _load_fs()).exists(path.join(possibleLoc, (_constants || _load_constants()).INTEGRITY_FILENAME))) {
            loc = possibleLoc;
            break;
          }
        }
        locationFolder = loc || possibleFolders[0];
      }

      const locationPath = path.join(locationFolder, (_constants || _load_constants()).INTEGRITY_FILENAME);
      const exists = yield (_fs || _load_fs()).exists(locationPath);

      return {
        locationFolder: locationFolder,
        locationPath: locationPath,
        exists: exists
      };
    })();
  }

  /**
   * returns a list of files recursively in a directory sorted
   */
  _getFilesDeep(rootDir) {
    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      let getFilePaths = (() => {
        var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (rootDir, files) {
          let currentDir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : rootDir;

          for (const file of yield (_fs || _load_fs()).readdir(currentDir)) {
            const entry = path.join(currentDir, file);
            const stat = yield (_fs || _load_fs()).stat(entry);
            if (stat.isDirectory()) {
              yield getFilePaths(rootDir, files, entry);
            } else {
              files.push(path.relative(rootDir, entry));
            }
          }
        });

        return function getFilePaths(_x2, _x3) {
          return _ref.apply(this, arguments);
        };
      })();

      const result = [];
      yield getFilePaths(rootDir, result);
      return result;
    })();
  }

  /**
   * Generate integrity hash of input lockfile.
   */

  _generateIntegrityFile(lockfile, patterns, flags, modulesFolder, artifacts) {
    var _this2 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {

      const result = {
        flags: [],
        linkedModules: [],
        topLevelPatters: [],
        lockfileEntries: {},
        files: [],
        artifacts: artifacts
      };

      result.topLevelPatters = patterns.sort((_misc || _load_misc()).sortAlpha);

      if (flags.flat) {
        result.flags.push('flat');
      }
      if (flags.ignoreScripts) {
        result.flags.push('ignoreScripts');
      }

      if (_this2.config.production) {
        result.flags.push('production');
      }

      const linkedModules = _this2.config.linkedModules;
      if (linkedModules.length) {
        result.linkedModules = linkedModules.sort((_misc || _load_misc()).sortAlpha);
      }

      (0, (_keys || _load_keys()).default)(lockfile).forEach(function (key) {
        result.lockfileEntries[key] = lockfile[key].resolved;
      });

      if (flags.checkFiles) {
        result.files = yield _this2._getFilesDeep(modulesFolder);
      }

      return result;
    })();
  }

  _getIntegrityFile(locationPath) {
    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const expectedRaw = yield (_fs || _load_fs()).readFile(locationPath);
      try {
        return JSON.parse(expectedRaw);
      } catch (e) {
        // ignore JSON parsing for legacy text integrity files compatibility
      }
      return null;
    })();
  }

  _compareIntegrityFiles(actual, expected, checkFiles, locationFolder) {
    var _this3 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      if (!expected) {
        return 'EXPECTED_IS_NOT_A_JSON';
      }
      if (!(0, (_misc || _load_misc()).compareSortedArrays)(actual.linkedModules, expected.linkedModules)) {
        return 'LINKED_MODULES_DONT_MATCH';
      }
      if (!(0, (_misc || _load_misc()).compareSortedArrays)(actual.flags, expected.flags)) {
        return 'FLAGS_DONT_MATCH';
      }
      for (const key of (0, (_keys || _load_keys()).default)(actual.lockfileEntries)) {
        if (actual.lockfileEntries[key] !== expected.lockfileEntries[key]) {
          return 'LOCKFILE_DONT_MATCH';
        }
      }
      for (const key of (0, (_keys || _load_keys()).default)(expected.lockfileEntries)) {
        if (actual.lockfileEntries[key] !== expected.lockfileEntries[key]) {
          return 'LOCKFILE_DONT_MATCH';
        }
      }
      if (checkFiles) {
        if (expected.files.length === 0) {
          // edge case handling - --check-fies is passed but .yarn-integrity does not contain any files
          // check and fail if there are file in node_modules after all.
          const actualFiles = yield _this3._getFilesDeep(locationFolder);
          if (actualFiles.length > 0) {
            return 'FILES_MISSING';
          }
        } else {
          // TODO we may want to optimise this check by checking only for package.json files on very large trees
          for (const file of expected.files) {
            if (!(yield (_fs || _load_fs()).exists(path.join(locationFolder, file)))) {
              return 'FILES_MISSING';
            }
          }
        }
      }
      return 'OK';
    })();
  }

  check(patterns, lockfile, flags) {
    var _this4 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      // check if patterns exist in lockfile
      const missingPatterns = patterns.filter(function (p) {
        return !lockfile[p];
      });
      const loc = yield _this4._getIntegrityHashLocation();
      if (missingPatterns.length || !loc.exists) {
        return {
          integrityFileMissing: !loc.exists,
          missingPatterns: missingPatterns
        };
      }

      const actual = yield _this4._generateIntegrityFile(lockfile, patterns, (0, (_assign || _load_assign()).default)({}, flags, { checkFiles: false }), // don't generate files when checking, we check the files below
      loc.locationFolder);
      const expected = yield _this4._getIntegrityFile(loc.locationPath);
      const integrityMatches = yield _this4._compareIntegrityFiles(actual, expected, flags.checkFiles, loc.locationFolder);

      return {
        integrityFileMissing: false,
        integrityMatches: integrityMatches === 'OK',
        integrityError: integrityMatches === 'OK' ? undefined : integrityMatches,
        missingPatterns: missingPatterns
      };
    })();
  }

  /**
   * Get artifacts from integrity file if it exists.
   */
  getArtifacts() {
    var _this5 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const loc = yield _this5._getIntegrityHashLocation();
      if (!loc.exists) {
        return null;
      }

      const expectedRaw = yield (_fs || _load_fs()).readFile(loc.locationPath);
      let expected;
      try {
        expected = JSON.parse(expectedRaw);
      } catch (e) {
        // ignore JSON parsing for legacy text integrity files compatibility
      }

      return expected ? expected.artifacts : null;
    })();
  }

  /**
   * Write the integrity hash of the current install to disk.
   */
  save(patterns, lockfile, flags, usedRegistries, artifacts) {
    var _this6 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const loc = yield _this6._getIntegrityHashLocation(usedRegistries);
      invariant(loc.locationPath, 'expected integrity hash location');
      yield (_fs || _load_fs()).mkdirp(path.dirname(loc.locationPath));
      const integrityFile = yield _this6._generateIntegrityFile(lockfile, patterns, flags, loc.locationFolder, artifacts);
      yield (_fs || _load_fs()).writeFile(loc.locationPath, (0, (_stringify || _load_stringify()).default)(integrityFile, null, 2));
    })();
  }

  removeIntegrityFile() {
    var _this7 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const loc = yield _this7._getIntegrityHashLocation();
      if (loc.exists) {
        yield (_fs || _load_fs()).unlink(loc.locationPath);
      }
    })();
  }
}
exports.default = InstallationIntegrityChecker;