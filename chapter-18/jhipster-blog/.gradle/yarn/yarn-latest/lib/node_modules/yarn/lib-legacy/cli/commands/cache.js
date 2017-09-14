'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.examples = exports.setFlags = exports.run = undefined;

var _toConsumableArray2;

function _load_toConsumableArray() {
  return _toConsumableArray2 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

exports.hasWrapper = hasWrapper;

var _buildSubCommands2;

function _load_buildSubCommands() {
  return _buildSubCommands2 = _interopRequireDefault(require('./_build-sub-commands.js'));
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

var _constants;

function _load_constants() {
  return _constants = require('../../constants');
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const path = require('path');

function hasWrapper(flags, args) {
  return args[0] !== 'dir';
}

var _buildSubCommands = (0, (_buildSubCommands2 || _load_buildSubCommands()).default)('cache', {
  ls: (() => {
    var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
      let readCacheMetadata = (() => {
        var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
          let parentDir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : config.cacheFolder;
          let metadataFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (_constants || _load_constants()).METADATA_FILENAME;

          const folders = yield (_fs || _load_fs()).readdir(parentDir);
          const packagesMetadata = [];

          for (const folder of folders) {
            if (folder[0] === '.') {
              continue;
            }

            const loc = path.join(config.cacheFolder, parentDir.replace(config.cacheFolder, ''), folder);
            // Check if this is a scoped package
            if (!(yield (_fs || _load_fs()).exists(path.join(loc, metadataFile)))) {
              // If so, recurrently read scoped packages metadata
              packagesMetadata.push.apply(packagesMetadata, (0, (_toConsumableArray2 || _load_toConsumableArray()).default)((yield readCacheMetadata(loc))));
            } else {
              var _ref3 = yield config.readPackageMetadata(loc);

              const registry = _ref3.registry,
                    manifest = _ref3.package,
                    remote = _ref3.remote;

              packagesMetadata.push([manifest.name, manifest.version, registry, remote && remote.resolved || '']);
            }
          }

          return packagesMetadata;
        });

        return function readCacheMetadata() {
          return _ref2.apply(this, arguments);
        };
      })();

      const body = yield readCacheMetadata();

      reporter.table(['Name', 'Version', 'Registry', 'Resolved'], body);
    });

    function ls(_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    }

    return ls;
  })(),
  dir: function dir(config, reporter) {
    reporter.log(config.cacheFolder);
  },
  clean: (() => {
    var _ref4 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
      if (config.cacheFolder) {
        yield (_fs || _load_fs()).unlink(config._cacheRootFolder);
        yield (_fs || _load_fs()).mkdirp(config.cacheFolder);
        reporter.success(reporter.lang('clearedCache'));
      }
    });

    function clean(_x7, _x8, _x9, _x10) {
      return _ref4.apply(this, arguments);
    }

    return clean;
  })()
});

const run = _buildSubCommands.run,
      setFlags = _buildSubCommands.setFlags,
      examples = _buildSubCommands.examples;
exports.run = run;
exports.setFlags = setFlags;
exports.examples = examples;