'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2;

function _load_slicedToArray() {
  return _slicedToArray2 = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray'));
}

var _assign;

function _load_assign() {
  return _assign = _interopRequireDefault(require('babel-runtime/core-js/object/assign'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _errors;

function _load_errors() {
  return _errors = require('../../errors.js');
}

var _exoticResolver;

function _load_exoticResolver() {
  return _exoticResolver = _interopRequireDefault(require('./exotic-resolver.js'));
}

var _misc;

function _load_misc() {
  return _misc = _interopRequireWildcard(require('../../util/misc.js'));
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const invariant = require('invariant');
const path = require('path');
const uuid = require('uuid');

class FileResolver extends (_exoticResolver || _load_exoticResolver()).default {
  constructor(request, fragment) {
    super(request, fragment);
    this.loc = (_misc || _load_misc()).removePrefix(fragment, 'file:');
  }

  resolve() {
    var _this = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      let loc = _this.loc;
      if (!path.isAbsolute(loc)) {
        loc = path.join(_this.config.cwd, loc);
      }
      if (!(yield (_fs || _load_fs()).exists(loc))) {
        throw new (_errors || _load_errors()).MessageError(_this.reporter.lang('doesntExist', loc));
      }

      const manifest = yield _this.config.readManifest(loc, _this.registry);
      const registry = manifest._registry;
      invariant(registry, 'expected registry');

      manifest._remote = {
        type: 'copy',
        registry: registry,
        hash: `${uuid.v4()}-${new Date().getTime()}`,
        reference: loc
      };

      manifest._uid = manifest.version;

      // Normalize relative paths; if anything changes, make a copy of the manifest
      const dependencies = _this.normalizeDependencyPaths(manifest.dependencies, loc);
      const optionalDependencies = _this.normalizeDependencyPaths(manifest.optionalDependencies, loc);

      if (dependencies !== manifest.dependencies || optionalDependencies !== manifest.optionalDependencies) {
        const _manifest = (0, (_assign || _load_assign()).default)({}, manifest);
        if (dependencies != null) {
          _manifest.dependencies = dependencies;
        }
        if (optionalDependencies != null) {
          _manifest.optionalDependencies = optionalDependencies;
        }
        return _manifest;
      } else {
        return manifest;
      }
    })();
  }

  normalizeDependencyPaths(section, loc) {
    if (section == null) {
      return section;
    }

    let temp = section;

    for (const _ref of (_misc || _load_misc()).entries(section)) {
      var _ref2 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref, 2);

      const k = _ref2[0];
      const v = _ref2[1];

      if (typeof v === 'string' && v.startsWith('file:') && !path.isAbsolute(v)) {
        if (temp === section) {
          temp = (0, (_assign || _load_assign()).default)({}, section);
        }
        temp[k] = `file:${path.relative(this.config.cwd, path.join(loc, (_misc || _load_misc()).removePrefix(v, 'file:')))}`;
      }
    }

    return temp;
  }
}
exports.default = FileResolver;
FileResolver.protocol = 'file';