'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _executeLifecycleScript;

function _load_executeLifecycleScript() {
  return _executeLifecycleScript = require('./util/execute-lifecycle-script.js');
}

var _index;

function _load_index() {
  return _index = _interopRequireDefault(require('./util/normalize-manifest/index.js'));
}

var _errors;

function _load_errors() {
  return _errors = require('./errors.js');
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('./util/fs.js'));
}

var _constants;

function _load_constants() {
  return _constants = _interopRequireWildcard(require('./constants.js'));
}

var _packageConstraintResolver;

function _load_packageConstraintResolver() {
  return _packageConstraintResolver = _interopRequireDefault(require('./package-constraint-resolver.js'));
}

var _requestManager;

function _load_requestManager() {
  return _requestManager = _interopRequireDefault(require('./util/request-manager.js'));
}

var _index2;

function _load_index2() {
  return _index2 = require('./registries/index.js');
}

var _index3;

function _load_index3() {
  return _index3 = require('./reporters/index.js');
}

var _map;

function _load_map() {
  return _map = _interopRequireDefault(require('./util/map.js'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const detectIndent = require('detect-indent');
const invariant = require('invariant');
const path = require('path');

function sortObject(object) {
  const sortedObject = {};
  Object.keys(object).sort().forEach(item => {
    sortedObject[item] = object[item];
  });
  return sortedObject;
}

class Config {
  constructor(reporter) {
    this.constraintResolver = new (_packageConstraintResolver || _load_packageConstraintResolver()).default(this, reporter);
    this.requestManager = new (_requestManager || _load_requestManager()).default(reporter);
    this.reporter = reporter;
    this._init({});
  }

  //


  //


  //


  //


  //


  //


  //


  //


  //


  //


  //


  //


  //


  // Whether we should ignore executing lifecycle scripts


  //


  //


  //


  //


  /**
   * Execute a promise produced by factory if it doesn't exist in our cache with
   * the associated key.
   */

  getCache(key, factory) {
    const cached = this.cache[key];
    if (cached) {
      return cached;
    }

    return this.cache[key] = factory().catch(err => {
      this.cache[key] = null;
      throw err;
    });
  }

  /**
   * Get a config option from our yarn config.
   */

  getOption(key) {
    return this.registries.yarn.getOption(key);
  }

  /**
   * Reduce a list of versions to a single one based on an input range.
   */

  resolveConstraints(versions, range) {
    return this.constraintResolver.reduce(versions, range);
  }

  /**
   * Initialise config. Fetch registry options, find package roots.
   */

  init() {
    var _this = this;

    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      _this._init(opts);

      yield (_fs || _load_fs()).mkdirp(_this.globalFolder);
      yield (_fs || _load_fs()).mkdirp(_this.linkFolder);

      _this.linkedModules = [];

      const linkedModules = yield (_fs || _load_fs()).readdir(_this.linkFolder);

      for (const dir of linkedModules) {
        const linkedPath = path.join(_this.linkFolder, dir);

        if (dir[0] === '@') {
          // it's a scope, not a package
          const scopedLinked = yield (_fs || _load_fs()).readdir(linkedPath);
          _this.linkedModules.push(...scopedLinked.map(function (scopedDir) {
            return path.join(dir, scopedDir);
          }));
        } else {
          _this.linkedModules.push(dir);
        }
      }

      for (const key of Object.keys((_index2 || _load_index2()).registries)) {
        const Registry = (_index2 || _load_index2()).registries[key];

        // instantiate registry
        const registry = new Registry(_this.cwd, _this.registries, _this.requestManager, _this.reporter);
        yield registry.init();

        _this.registries[key] = registry;
        _this.registryFolders.push(registry.folder);
        const rootModuleFolder = path.join(_this.cwd, registry.folder);
        if (_this.rootModuleFolders.indexOf(rootModuleFolder) < 0) {
          _this.rootModuleFolders.push(rootModuleFolder);
        }
      }

      _this.networkConcurrency = opts.networkConcurrency || Number(_this.getOption('network-concurrency')) || (_constants || _load_constants()).NETWORK_CONCURRENCY;

      _this.childConcurrency = opts.childConcurrency || Number(_this.getOption('child-concurrency')) || Number(process.env.CHILD_CONCURRENCY) || (_constants || _load_constants()).CHILD_CONCURRENCY;

      _this.networkTimeout = opts.networkTimeout || Number(_this.getOption('network-timeout')) || (_constants || _load_constants()).NETWORK_TIMEOUT;

      _this.requestManager.setOptions({
        userAgent: String(_this.getOption('user-agent')),
        httpProxy: String(opts.httpProxy || _this.getOption('proxy') || ''),
        httpsProxy: String(opts.httpsProxy || _this.getOption('https-proxy') || ''),
        strictSSL: Boolean(_this.getOption('strict-ssl')),
        ca: Array.prototype.concat(opts.ca || _this.getOption('ca') || []).map(String),
        cafile: String(opts.cafile || _this.getOption('cafile') || ''),
        cert: String(opts.cert || _this.getOption('cert') || ''),
        key: String(opts.key || _this.getOption('key') || ''),
        networkConcurrency: _this.networkConcurrency,
        networkTimeout: _this.networkTimeout
      });
      _this._cacheRootFolder = String(opts.cacheFolder || _this.getOption('cache-folder') || (_constants || _load_constants()).MODULE_CACHE_DIRECTORY);

      _this.pruneOfflineMirror = Boolean(_this.getOption('yarn-offline-mirror-pruning'));
      _this.enableMetaFolder = Boolean(_this.getOption('enable-meta-folder'));

      //init & create cacheFolder, tempFolder
      _this.cacheFolder = path.join(_this._cacheRootFolder, 'v' + String((_constants || _load_constants()).CACHE_VERSION));
      _this.tempFolder = opts.tempFolder || path.join(_this.cacheFolder, '.tmp');
      yield (_fs || _load_fs()).mkdirp(_this.cacheFolder);
      yield (_fs || _load_fs()).mkdirp(_this.tempFolder);

      if (opts.production === 'false') {
        _this.production = false;
      } else if (_this.getOption('production') || process.env.NODE_ENV === 'production' && process.env.NPM_CONFIG_PRODUCTION !== 'false' && process.env.YARN_PRODUCTION !== 'false') {
        _this.production = true;
      } else {
        _this.production = !!opts.production;
      }
    })();
  }

  _init(opts) {
    this.rootModuleFolders = [];
    this.registryFolders = [];
    this.linkedModules = [];

    this.registries = (0, (_map || _load_map()).default)();
    this.cache = (0, (_map || _load_map()).default)();
    this.cwd = opts.cwd || this.cwd || process.cwd();

    this.looseSemver = opts.looseSemver == undefined ? true : opts.looseSemver;

    this.commandName = opts.commandName || '';

    this.preferOffline = !!opts.preferOffline;
    this.modulesFolder = opts.modulesFolder;
    this.globalFolder = opts.globalFolder || (_constants || _load_constants()).GLOBAL_MODULE_DIRECTORY;
    this.linkFolder = opts.linkFolder || (_constants || _load_constants()).LINK_REGISTRY_DIRECTORY;
    this.offline = !!opts.offline;
    this.binLinks = !!opts.binLinks;

    this.ignorePlatform = !!opts.ignorePlatform;
    this.ignoreScripts = !!opts.ignoreScripts;

    this.nonInteractive = !!opts.nonInteractive;

    this.requestManager.setOptions({
      offline: !!opts.offline && !opts.preferOffline,
      captureHar: !!opts.captureHar
    });

    if (this.modulesFolder) {
      this.rootModuleFolders.push(this.modulesFolder);
    }
  }

  /**
   * Generate an absolute module path.
   */

  generateHardModulePath(pkg, ignoreLocation) {
    invariant(this.cacheFolder, 'No package root');
    invariant(pkg, 'Undefined package');

    if (pkg.location && !ignoreLocation) {
      return pkg.location;
    }

    let name = pkg.name;
    let uid = pkg.uid;
    if (pkg.registry) {
      name = `${pkg.registry}-${name}`;
    }

    const hash = pkg.remote.hash;


    if (pkg.version && pkg.version !== pkg.uid) {
      uid = `${pkg.version}-${uid}`;
    } else if (hash) {
      uid += `-${hash}`;
    }

    return path.join(this.cacheFolder, `${name}-${uid}`);
  }

  /**
   * Execute lifecycle scripts in the specified directory. Ignoring when the --ignore-scripts flag has been
   * passed.
   */

  executeLifecycleScript(commandName, cwd) {
    if (this.ignoreScripts) {
      return Promise.resolve();
    } else {
      return (0, (_executeLifecycleScript || _load_executeLifecycleScript()).execFromManifest)(this, commandName, cwd || this.cwd);
    }
  }

  /**
   * Generate an absolute temporary filename location based on the input filename.
   */

  getTemp(filename) {
    invariant(this.tempFolder, 'No temp folder');
    return path.join(this.tempFolder, filename);
  }

  /**
   * Remote packages may be cached in a file system to be available for offline installation.
   * Second time the same package needs to be installed it will be loaded from there.
   * Given a package's filename, return a path in the offline mirror location.
   */

  getOfflineMirrorPath(packageFilename) {
    let mirrorPath;

    for (const key of ['npm', 'yarn']) {
      const registry = this.registries[key];

      if (registry == null) {
        continue;
      }

      const registryMirrorPath = registry.config['yarn-offline-mirror'];

      if (registryMirrorPath === false) {
        return null;
      }

      if (registryMirrorPath == null) {
        continue;
      }

      mirrorPath = registryMirrorPath;
    }

    if (mirrorPath == null) {
      return null;
    }

    if (packageFilename == null) {
      return mirrorPath;
    }

    return path.join(mirrorPath, path.basename(packageFilename));
  }

  /**
   * Checker whether the folder input is a valid module folder. We output a yarn metadata
   * file when we've successfully setup a folder so use this as a marker.
   */

  isValidModuleDest(dest) {
    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      if (!(yield (_fs || _load_fs()).exists(dest))) {
        return false;
      }

      if (!(yield (_fs || _load_fs()).exists(path.join(dest, (_constants || _load_constants()).METADATA_FILENAME)))) {
        return false;
      }

      return true;
    })();
  }

  /**
   * Read package metadata and normalized package info.
   */

  readPackageMetadata(dir) {
    var _this2 = this;

    return this.getCache(`metadata-${dir}`, (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const metadata = yield _this2.readJson(path.join(dir, (_constants || _load_constants()).METADATA_FILENAME));
      const pkg = yield _this2.readManifest(dir, metadata.registry);

      return {
        package: pkg,
        artifacts: metadata.artifacts || [],
        hash: metadata.hash,
        remote: metadata.remote,
        registry: metadata.registry
      };
    }));
  }

  /**
   * Read normalized package info according yarn-metadata.json
   * throw an error if package.json was not found
   */

  readManifest(dir, priorityRegistry) {
    var _this3 = this;

    let isRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const manifest = yield _this3.maybeReadManifest(dir, priorityRegistry, isRoot);

      if (manifest) {
        return manifest;
      } else {
        throw new (_errors || _load_errors()).MessageError(_this3.reporter.lang('couldntFindPackagejson', dir), 'ENOENT');
      }
    })();
  }

  /**
  * try get the manifest file by looking
  * 1. mainfest file in cache
  * 2. manifest file in registry
  */
  maybeReadManifest(dir, priorityRegistry) {
    var _this4 = this;

    let isRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    return this.getCache(`manifest-${dir}`, (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const metadataLoc = path.join(dir, (_constants || _load_constants()).METADATA_FILENAME);
      if (!priorityRegistry && (yield (_fs || _load_fs()).exists(metadataLoc))) {
        var _ref3 = yield _this4.readJson(metadataLoc);

        priorityRegistry = _ref3.registry;
      }

      if (priorityRegistry) {
        const file = yield _this4.tryManifest(dir, priorityRegistry, isRoot);
        if (file) {
          return file;
        }
      }

      for (const registry of Object.keys((_index2 || _load_index2()).registries)) {
        if (priorityRegistry === registry) {
          continue;
        }

        const file = yield _this4.tryManifest(dir, registry, isRoot);
        if (file) {
          return file;
        }
      }

      return null;
    }));
  }

  /**
   * Read the root manifest.
   */

  readRootManifest() {
    return this.readManifest(this.cwd, 'npm', true);
  }

  /**
   * Try and find package info with the input directory and registry.
   */

  tryManifest(dir, registry, isRoot) {
    var _this5 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const filename = (_index2 || _load_index2()).registries[registry].filename;

      const loc = path.join(dir, filename);
      if (yield (_fs || _load_fs()).exists(loc)) {
        const data = yield _this5.readJson(loc);
        data._registry = registry;
        data._loc = loc;
        return (0, (_index || _load_index()).default)(data, dir, _this5, isRoot);
      } else {
        return null;
      }
    })();
  }

  /**
   * Description
   */

  getFolder(pkg) {
    let registryName = pkg._registry;
    if (!registryName) {
      const ref = pkg._reference;
      invariant(ref, 'expected reference');
      registryName = ref.registry;
    }
    return this.registries[registryName].folder;
  }

  /**
   * Get root manifests.
   */

  getRootManifests() {
    var _this6 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const manifests = {};
      for (const registryName of (_index2 || _load_index2()).registryNames) {
        const registry = (_index2 || _load_index2()).registries[registryName];
        const jsonLoc = path.join(_this6.cwd, registry.filename);

        let object = {};
        let exists = false;
        let indent;
        if (yield (_fs || _load_fs()).exists(jsonLoc)) {
          exists = true;

          const info = yield _this6.readJson(jsonLoc, (_fs || _load_fs()).readJsonAndFile);
          object = info.object;
          indent = detectIndent(info.content).indent || undefined;
        }
        manifests[registryName] = { loc: jsonLoc, object, exists, indent };
      }
      return manifests;
    })();
  }

  /**
   * Save root manifests.
   */

  saveRootManifests(manifests) {
    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      for (const registryName of (_index2 || _load_index2()).registryNames) {
        var _manifests$registryNa = manifests[registryName];
        const loc = _manifests$registryNa.loc,
              object = _manifests$registryNa.object,
              exists = _manifests$registryNa.exists,
              indent = _manifests$registryNa.indent;

        if (!exists && !Object.keys(object).length) {
          continue;
        }

        for (const field of (_constants || _load_constants()).DEPENDENCY_TYPES) {
          if (object[field]) {
            object[field] = sortObject(object[field]);
          }
        }

        yield (_fs || _load_fs()).writeFilePreservingEol(loc, JSON.stringify(object, null, indent || (_constants || _load_constants()).DEFAULT_INDENT) + '\n');
      }
    })();
  }

  /**
   * Call the passed factory (defaults to fs.readJson) and rethrow a pretty error message if it was the result
   * of a syntax error.
   */

  readJson(loc) {
    var _this7 = this;

    let factory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (_fs || _load_fs()).readJson;
    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      try {
        return yield factory(loc);
      } catch (err) {
        if (err instanceof SyntaxError) {
          throw new (_errors || _load_errors()).MessageError(_this7.reporter.lang('jsonError', loc, err.message));
        } else {
          throw err;
        }
      }
    })();
  }

  static create() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let reporter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new (_index3 || _load_index3()).NoopReporter();
    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const config = new Config(reporter);
      yield config.init(opts);
      return config;
    })();
  }
}
exports.default = Config;