'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.Import = exports.noArguments = undefined;

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let run = exports.run = (() => {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    const imp = new Import(flags, config, reporter, new (_wrapper || _load_wrapper()).default({}));
    yield imp.init();
  });

  return function run(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

exports.setFlags = setFlags;
exports.hasWrapper = hasWrapper;

var _install;

function _load_install() {
  return _install = require('./install.js');
}

var _check;

function _load_check() {
  return _check = require('./check.js');
}

var _errors;

function _load_errors() {
  return _errors = require('../../errors.js');
}

var _baseResolver;

function _load_baseResolver() {
  return _baseResolver = _interopRequireDefault(require('../../resolvers/base-resolver.js'));
}

var _hostedGitResolver;

function _load_hostedGitResolver() {
  return _hostedGitResolver = _interopRequireDefault(require('../../resolvers/exotics/hosted-git-resolver.js'));
}

var _hostedGitResolver2;

function _load_hostedGitResolver2() {
  return _hostedGitResolver2 = require('../../resolvers/exotics/hosted-git-resolver.js');
}

var _gistResolver;

function _load_gistResolver() {
  return _gistResolver = _interopRequireDefault(require('../../resolvers/exotics/gist-resolver.js'));
}

var _gistResolver2;

function _load_gistResolver2() {
  return _gistResolver2 = require('../../resolvers/exotics/gist-resolver.js');
}

var _gitResolver;

function _load_gitResolver() {
  return _gitResolver = _interopRequireDefault(require('../../resolvers/exotics/git-resolver.js'));
}

var _fileResolver;

function _load_fileResolver() {
  return _fileResolver = _interopRequireDefault(require('../../resolvers/exotics/file-resolver.js'));
}

var _packageResolver;

function _load_packageResolver() {
  return _packageResolver = _interopRequireDefault(require('../../package-resolver.js'));
}

var _packageRequest;

function _load_packageRequest() {
  return _packageRequest = _interopRequireDefault(require('../../package-request.js'));
}

var _packageFetcher;

function _load_packageFetcher() {
  return _packageFetcher = _interopRequireDefault(require('../../package-fetcher.js'));
}

var _packageLinker;

function _load_packageLinker() {
  return _packageLinker = _interopRequireDefault(require('../../package-linker.js'));
}

var _packageCompatibility;

function _load_packageCompatibility() {
  return _packageCompatibility = _interopRequireDefault(require('../../package-compatibility.js'));
}

var _wrapper;

function _load_wrapper() {
  return _wrapper = _interopRequireDefault(require('../../lockfile/wrapper.js'));
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

var _misc;

function _load_misc() {
  return _misc = _interopRequireWildcard(require('../../util/misc.js'));
}

var _constants;

function _load_constants() {
  return _constants = require('../../constants.js');
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NPM_REGISTRY = /http[s]:\/\/registry.npmjs.org/g;

const invariant = require('invariant');
const path = require('path');
const uuid = require('uuid');

const noArguments = exports.noArguments = true;

class ImportResolver extends (_baseResolver || _load_baseResolver()).default {
  getCwd() {
    if (this.request.parentRequest) {
      const parent = this.resolver.getStrictResolvedPattern(this.request.parentRequest.pattern);
      invariant(parent._loc, 'expected package location');
      return path.dirname(parent._loc);
    }
    return this.config.cwd;
  }

  resolveHostedGit(info, Resolver) {
    var _PackageRequest$norma = (_packageRequest || _load_packageRequest()).default.normalizePattern(this.pattern);

    const range = _PackageRequest$norma.range;

    const exploded = (0, (_hostedGitResolver2 || _load_hostedGitResolver2()).explodeHostedGitFragment)(range, this.reporter);
    const hash = info.gitHead;
    invariant(hash, 'expected package gitHead');
    const url = Resolver.getTarballUrl(exploded, hash);
    info._uid = hash;
    info._remote = {
      resolved: url,
      type: 'tarball',
      registry: this.registry,
      reference: url,
      hash: null
    };
    return info;
  }

  resolveGist(info, Resolver) {
    var _PackageRequest$norma2 = (_packageRequest || _load_packageRequest()).default.normalizePattern(this.pattern);

    const range = _PackageRequest$norma2.range;

    var _explodeGistFragment = (0, (_gistResolver2 || _load_gistResolver2()).explodeGistFragment)(range, this.reporter);

    const id = _explodeGistFragment.id;

    const hash = info.gitHead;
    invariant(hash, 'expected package gitHead');
    const url = `https://gist.github.com/${id}.git`;
    info._uid = hash;
    info._remote = {
      resolved: `${url}#${hash}`,
      type: 'git',
      registry: this.registry,
      reference: url,
      hash: hash
    };
    return info;
  }

  resolveGit(info, Resolver) {
    const url = info._resolved;
    const hash = info.gitHead;
    invariant(url, 'expected package _resolved');
    invariant(hash, 'expected package gitHead');
    info._uid = hash;
    info._remote = {
      resolved: `${url}#${hash}`,
      type: 'git',
      registry: this.registry,
      reference: url,
      hash: hash
    };
    return info;
  }

  resolveFile(info, Resolver) {
    var _PackageRequest$norma3 = (_packageRequest || _load_packageRequest()).default.normalizePattern(this.pattern);

    const range = _PackageRequest$norma3.range;

    let loc = (_misc || _load_misc()).removePrefix(range, 'file:');
    if (!path.isAbsolute(loc)) {
      loc = path.join(this.config.cwd, loc);
    }
    info._uid = info.version;
    info._remote = {
      type: 'copy',
      registry: this.registry,
      hash: `${uuid.v4()}-${new Date().getTime()}`,
      reference: loc
    };
    return info;
  }

  resolveRegistry(info) {
    let url = info._resolved;
    const hash = info._shasum;
    invariant(url, 'expected package _resolved');
    invariant(hash, 'expected package _shasum');
    if (this.config.getOption('registry') === (_constants || _load_constants()).YARN_REGISTRY) {
      url = url.replace(NPM_REGISTRY, (_constants || _load_constants()).YARN_REGISTRY);
    }
    info._uid = info.version;
    info._remote = {
      resolved: `${url}#${hash}`,
      type: 'tarball',
      registry: this.registry,
      reference: url,
      hash: hash
    };
    return info;
  }

  resolveImport(info) {
    var _PackageRequest$norma4 = (_packageRequest || _load_packageRequest()).default.normalizePattern(this.pattern);

    const range = _PackageRequest$norma4.range;

    const Resolver = (_packageRequest || _load_packageRequest()).default.getExoticResolver(range);
    if (Resolver && Resolver.prototype instanceof (_hostedGitResolver || _load_hostedGitResolver()).default) {
      return this.resolveHostedGit(info, Resolver);
    } else if (Resolver && Resolver === (_gistResolver || _load_gistResolver()).default) {
      return this.resolveGist(info, Resolver);
    } else if (Resolver && Resolver === (_gitResolver || _load_gitResolver()).default) {
      return this.resolveGit(info, Resolver);
    } else if (Resolver && Resolver === (_fileResolver || _load_fileResolver()).default) {
      return this.resolveFile(info, Resolver);
    }
    return this.resolveRegistry(info);
  }

  resolveLocation(loc) {
    var _this = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const info = yield _this.config.tryManifest(loc, 'npm', false);
      if (!info) {
        return null;
      }
      return _this.resolveImport(info);
    })();
  }

  resolve() {
    var _this2 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      var _PackageRequest$norma5 = (_packageRequest || _load_packageRequest()).default.normalizePattern(_this2.pattern);

      const name = _PackageRequest$norma5.name;

      let cwd = _this2.getCwd();
      while (!path.relative(_this2.config.cwd, cwd).startsWith('..')) {
        const loc = path.join(cwd, 'node_modules', name);
        const info = yield _this2.config.getCache(`import-resolver-${loc}`, function () {
          return _this2.resolveLocation(loc);
        });
        if (info) {
          return info;
        }
        cwd = path.resolve(cwd, '../..');
      }
      throw new (_errors || _load_errors()).MessageError(_this2.reporter.lang('importResolveFailed', name, _this2.getCwd()));
    })();
  }
}

class ImportPackageRequest extends (_packageRequest || _load_packageRequest()).default {
  constructor(req, resolver) {
    super(req, resolver);
    this.import = this.parentRequest instanceof ImportPackageRequest ? this.parentRequest.import : true;
  }

  getRootName() {
    return this.resolver instanceof ImportPackageResolver && this.resolver.rootName || 'root';
  }

  getParentHumanName() {
    return [this.getRootName()].concat(this.getParentNames()).join(' > ');
  }

  reportResolvedRangeMatch(info, resolved) {
    if (info.version === resolved.version) {
      return;
    }
    this.reporter.warn(this.reporter.lang('importResolvedRangeMatch', resolved.version, resolved.name, info.version, this.getParentHumanName()));
  }

  findVersionInfo() {
    if (!this.import) {
      this.reporter.verbose(this.reporter.lang('skippingImport', this.pattern, this.getParentHumanName()));
      return super.findVersionInfo();
    }
    const resolver = new ImportResolver(this, this.pattern);
    return resolver.resolve().catch(() => {
      this.import = false;
      this.reporter.warn(this.reporter.lang('importFailed', this.pattern, this.getParentHumanName()));
      return super.findVersionInfo();
    });
  }
}

class ImportPackageResolver extends (_packageResolver || _load_packageResolver()).default {
  constructor(config, lockfile) {
    super(config, lockfile);
    this.next = [];
    this.rootName = 'root';
  }

  find(req) {
    this.next.push(req);
    return (_promise || _load_promise()).default.resolve();
  }

  findOne(req) {
    var _this3 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      if (_this3.activity) {
        _this3.activity.tick(req.pattern);
      }
      const request = new ImportPackageRequest(req, _this3);
      yield request.find();
    })();
  }

  findAll(deps) {
    var _this4 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      yield (_promise || _load_promise()).default.all(deps.map(function (dep) {
        return _this4.findOne(dep);
      }));
      deps = _this4.next;
      _this4.next = [];
      if (!deps.length) {
        return;
      }
      yield _this4.findAll(deps);
    })();
  }

  resetOptional() {
    for (const pattern in this.patterns) {
      const ref = this.patterns[pattern]._reference;
      invariant(ref, 'expected reference');
      ref.optional = null;
      for (const req of ref.requests) {
        ref.addOptional(req.optional);
      }
    }
  }

  init(deps, isFlat, rootName) {
    var _this5 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      _this5.flat = isFlat;
      _this5.rootName = rootName || _this5.rootName;
      const activity = _this5.activity = _this5.reporter.activity();
      _this5.seedPatterns = deps.map(function (dep) {
        return dep.pattern;
      });
      yield _this5.findAll(deps);
      _this5.resetOptional();
      activity.end();
      _this5.activity = null;
    })();
  }
}

class Import extends (_install || _load_install()).Install {
  constructor(flags, config, reporter, lockfile) {
    super(flags, config, reporter, lockfile);
    this.resolver = new ImportPackageResolver(this.config, this.lockfile);
    this.fetcher = new (_packageFetcher || _load_packageFetcher()).default(config, this.resolver);
    this.compatibility = new (_packageCompatibility || _load_packageCompatibility()).default(config, this.resolver, this.flags.ignoreEngines);
    this.linker = new (_packageLinker || _load_packageLinker()).default(config, this.resolver);
  }

  init() {
    var _this6 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      if (yield (_fs || _load_fs()).exists(path.join(_this6.config.cwd, (_constants || _load_constants()).LOCKFILE_FILENAME))) {
        throw new (_errors || _load_errors()).MessageError(_this6.reporter.lang('lockfileExists'));
      }
      yield (0, (_check || _load_check()).verifyTreeCheck)(_this6.config, _this6.reporter, {}, []);

      var _ref = yield _this6.fetchRequestFromCwd();

      const requests = _ref.requests,
            patterns = _ref.patterns,
            manifest = _ref.manifest;

      yield _this6.resolver.init(requests, _this6.flags.flat, manifest.name);
      yield _this6.fetcher.init();
      yield _this6.compatibility.init();
      yield _this6.linker.resolvePeerModules();
      yield _this6.saveLockfileAndIntegrity(patterns);
      return patterns;
    })();
  }
}

exports.Import = Import;
function setFlags() {}

function hasWrapper() {
  return true;
}