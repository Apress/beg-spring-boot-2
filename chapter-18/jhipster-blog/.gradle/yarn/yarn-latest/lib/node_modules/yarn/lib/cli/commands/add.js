'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.Add = undefined;

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let run = exports.run = (() => {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    if (!args.length) {
      throw new (_errors || _load_errors()).MessageError(reporter.lang('missingAddDependencies'));
    }

    const lockfile = yield (_wrapper || _load_wrapper()).default.fromDirectory(config.cwd, reporter);

    yield (0, (_install || _load_install()).wrapLifecycle)(config, flags, (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const install = new Add(args, flags, config, reporter, lockfile);
      yield install.init();
    }));
  });

  return function run(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

exports.hasWrapper = hasWrapper;
exports.setFlags = setFlags;

var _wrapper;

function _load_wrapper() {
  return _wrapper = _interopRequireDefault(require('../../lockfile/wrapper.js'));
}

var _packageRequest;

function _load_packageRequest() {
  return _packageRequest = _interopRequireDefault(require('../../package-request.js'));
}

var _list;

function _load_list() {
  return _list = require('./list.js');
}

var _install;

function _load_install() {
  return _install = require('./install.js');
}

var _errors;

function _load_errors() {
  return _errors = require('../../errors.js');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const invariant = require('invariant');

class Add extends (_install || _load_install()).Install {
  constructor(args, flags, config, reporter, lockfile) {
    super(flags, config, reporter, lockfile);
    this.args = args;
    // only one flag is supported, so we can figure out which one was passed to `yarn add`
    this.flagToOrigin = [flags.dev && 'devDependencies', flags.optional && 'optionalDependencies', flags.peer && 'peerDependencies', 'dependencies'].filter(Boolean).shift();
  }

  /**
   * TODO
   */

  prepareRequests(requests) {
    const requestsWithArgs = requests.slice();

    for (const pattern of this.args) {
      requestsWithArgs.push({
        pattern,
        registry: 'npm',
        optional: false
      });
    }
    return requestsWithArgs;
  }

  /**
   * returns version for a pattern based on Manifest
   */
  getPatternVersion(pattern, pkg) {
    var _flags = this.flags;
    const exact = _flags.exact,
          tilde = _flags.tilde;

    const parts = (_packageRequest || _load_packageRequest()).default.normalizePattern(pattern);
    let version;
    if ((_packageRequest || _load_packageRequest()).default.getExoticResolver(pattern)) {
      // wasn't a name/range tuple so this is just a raw exotic pattern
      version = pattern;
    } else if (parts.hasVersion && parts.range) {
      // if the user specified a range then use it verbatim
      version = parts.range === 'latest' ? `^${pkg.version}` : parts.range;
    } else if (tilde) {
      // --save-tilde
      version = `~${pkg.version}`;
    } else if (exact) {
      // --save-exact
      version = pkg.version;
    } else {
      // default to save prefix
      version = `${String(this.config.getOption('save-prefix') || '')}${pkg.version}`;
    }
    return version;
  }

  preparePatterns(patterns) {
    const preparedPatterns = patterns.slice();
    for (const pattern of this.resolver.dedupePatterns(this.args)) {
      const pkg = this.resolver.getResolvedPattern(pattern);
      invariant(pkg, `missing package ${pattern}`);
      const version = this.getPatternVersion(pattern, pkg);
      const newPattern = `${pkg.name}@${version}`;
      preparedPatterns.push(newPattern);
      this.addedPatterns.push(newPattern);
      if (newPattern === pattern) {
        continue;
      }
      this.resolver.replacePattern(pattern, newPattern);
    }
    return preparedPatterns;
  }

  bailout(patterns) {
    return Promise.resolve(false);
  }

  /**
   * Description
   */

  init() {
    var _this = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      _this.addedPatterns = [];
      const patterns = yield (_install || _load_install()).Install.prototype.init.call(_this);
      yield _this.maybeOutputSaveTree(patterns);
      yield _this.savePackages();
      return patterns;
    })();
  }

  /**
   * Description
   */

  fetchRequestFromCwd() {
    return (_install || _load_install()).Install.prototype.fetchRequestFromCwd.call(this, this.args);
  }

  /**
   * Output a tree of any newly added dependencies.
   */

  maybeOutputSaveTree(patterns) {
    var _this2 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      // don't limit the shown tree depth
      const opts = {
        reqDepth: 0
      };

      var _ref = yield (0, (_list || _load_list()).buildTree)(_this2.resolver, _this2.linker, patterns, opts, true, true);

      const trees = _ref.trees,
            count = _ref.count;

      _this2.reporter.success(count === 1 ? _this2.reporter.lang('savedNewDependency') : _this2.reporter.lang('savedNewDependencies', count));
      _this2.reporter.tree('newDependencies', trees);
    })();
  }

  /**
   * Save added packages to manifest if any of the --save flags were used.
   */

  savePackages() {
    var _this3 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      // fill rootPatternsToOrigin without `excludePatterns`
      yield (_install || _load_install()).Install.prototype.fetchRequestFromCwd.call(_this3);
      const patternOrigins = Object.keys(_this3.rootPatternsToOrigin);

      // get all the different registry manifests in this folder
      const manifests = yield _this3.config.getRootManifests();

      // add new patterns to their appropriate registry manifest
      for (const pattern of _this3.addedPatterns) {
        const pkg = _this3.resolver.getResolvedPattern(pattern);
        invariant(pkg, `missing package ${pattern}`);
        const version = _this3.getPatternVersion(pattern, pkg);
        const ref = pkg._reference;
        invariant(ref, 'expected package reference');
        // lookup the package to determine dependency type; used during `yarn upgrade`
        const depType = patternOrigins.reduce(function (acc, prev) {
          if (prev.indexOf(`${pkg.name}@`) === 0) {
            return _this3.rootPatternsToOrigin[prev];
          }
          return acc;
        }, null);

        // depType is calculated when `yarn upgrade` command is used
        const target = depType || _this3.flagToOrigin;

        // add it to manifest
        const object = manifests[ref.registry].object;


        object[target] = object[target] || {};
        object[target][pkg.name] = version;
      }

      yield _this3.config.saveRootManifests(manifests);
    })();
  }
}

exports.Add = Add;
function hasWrapper() {
  return true;
}

function setFlags(commander) {
  commander.usage('add [packages ...] [flags]');
  commander.option('-D, --dev', 'save package to your `devDependencies`');
  commander.option('-P, --peer', 'save package to your `peerDependencies`');
  commander.option('-O, --optional', 'save package to your `optionalDependencies`');
  commander.option('-E, --exact', 'install exact version');
  commander.option('-T, --tilde', 'install most recent release with the same minor version');
}