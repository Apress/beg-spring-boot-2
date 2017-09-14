'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULTS = undefined;

var _assign;

function _load_assign() {
  return _assign = _interopRequireDefault(require('babel-runtime/core-js/object/assign'));
}

var _slicedToArray2;

function _load_slicedToArray() {
  return _slicedToArray2 = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _constants;

function _load_constants() {
  return _constants = require('../constants.js');
}

var _npmRegistry;

function _load_npmRegistry() {
  return _npmRegistry = _interopRequireDefault(require('./npm-registry.js'));
}

var _stringify;

function _load_stringify() {
  return _stringify = _interopRequireDefault(require('../lockfile/stringify.js'));
}

var _parse;

function _load_parse() {
  return _parse = _interopRequireDefault(require('../lockfile/parse.js'));
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../util/fs.js'));
}

var _yarnVersion;

function _load_yarnVersion() {
  return _yarnVersion = require('../util/yarn-version.js');
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userHome = require('../util/user-home-dir').default;

const path = require('path');

const DEFAULTS = exports.DEFAULTS = {
  'version-tag-prefix': 'v',
  'version-git-tag': true,
  'version-git-sign': false,
  'version-git-message': 'v%s',

  'init-version': '1.0.0',
  'init-license': 'MIT',

  'save-prefix': '^',
  'ignore-scripts': false,
  'ignore-optional': false,
  registry: (_constants || _load_constants()).YARN_REGISTRY,
  'strict-ssl': true,
  'user-agent': [`yarn/${(_yarnVersion || _load_yarnVersion()).version}`, 'npm/?', `node/${process.version}`, process.platform, process.arch].join(' ')
};

const npmMap = {
  'version-git-sign': 'sign-git-tag',
  'version-tag-prefix': 'tag-version-prefix',
  'version-git-tag': 'git-tag-version',
  'version-git-message': 'message'
};

class YarnRegistry extends (_npmRegistry || _load_npmRegistry()).default {
  constructor(cwd, registries, requestManager, reporter) {
    super(cwd, registries, requestManager, reporter);

    this.homeConfigLoc = path.join(userHome, '.yarnrc');
    this.homeConfig = {};
  }

  getOption(key) {
    let val = this.config[key];

    // if this isn't set in a yarn config, then use npm
    if (typeof val === 'undefined') {
      val = this.registries.npm.getOption(npmMap[key]);
    }

    if (typeof val === 'undefined') {
      val = this.registries.npm.getOption(key);
    }

    // if this isn't set in a yarn config or npm config, then use the default (or undefined)
    if (typeof val === 'undefined') {
      val = DEFAULTS[key];
    }

    return val;
  }

  loadConfig() {
    var _this = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      for (const _ref of yield _this.getPossibleConfigLocations('.yarnrc', _this.reporter)) {
        var _ref2 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref, 3);

        const isHome = _ref2[0];
        const loc = _ref2[1];
        const file = _ref2[2];

        const config = (0, (_parse || _load_parse()).default)(file, loc);

        if (isHome) {
          _this.homeConfig = config;
        }

        // normalize offline mirror path relative to the current yarnrc
        const offlineLoc = config['yarn-offline-mirror'];

        // don't normalize if we already have a mirror path
        if (!_this.config['yarn-offline-mirror'] && offlineLoc) {
          const mirrorLoc = config['yarn-offline-mirror'] = path.resolve(path.dirname(loc), offlineLoc);
          yield (_fs || _load_fs()).mkdirp(mirrorLoc);
        }

        // merge with any existing environment variables
        const env = config.env;
        if (env) {
          const existingEnv = _this.config.env;
          if (existingEnv) {
            _this.config.env = (0, (_assign || _load_assign()).default)({}, env, existingEnv);
          }
        }

        _this.config = (0, (_assign || _load_assign()).default)({}, config, _this.config);
      }

      // default yarn config
      _this.config = (0, (_assign || _load_assign()).default)({}, DEFAULTS, _this.config);
    })();
  }

  saveHomeConfig(config) {
    var _this2 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      YarnRegistry.normalizeConfig(config);

      for (const key in config) {
        const val = config[key];

        // if the current config key was taken from home config then update
        // the global config
        if (_this2.homeConfig[key] === _this2.config[key]) {
          _this2.config[key] = val;
        }

        // update just the home config
        _this2.homeConfig[key] = config[key];
      }

      yield (_fs || _load_fs()).writeFilePreservingEol(_this2.homeConfigLoc, `${(0, (_stringify || _load_stringify()).default)(_this2.homeConfig)}\n`);
    })();
  }
}
exports.default = YarnRegistry;
YarnRegistry.filename = 'yarn.json';