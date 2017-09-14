'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _slicedToArray2;

function _load_slicedToArray() {
  return _slicedToArray2 = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray'));
}

var _map;

function _load_map() {
  return _map = _interopRequireDefault(require('babel-runtime/core-js/map'));
}

var _set;

function _load_set() {
  return _set = _interopRequireDefault(require('babel-runtime/core-js/set'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _executeLifecycleScript;

function _load_executeLifecycleScript() {
  return _executeLifecycleScript = _interopRequireDefault(require('./util/execute-lifecycle-script.js'));
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('./util/fs.js'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const invariant = require('invariant');

const INSTALL_STAGES = ['preinstall', 'install', 'postinstall'];

class PackageInstallScripts {
  constructor(config, resolver, force) {
    this.installed = 0;
    this.resolver = resolver;
    this.reporter = config.reporter;
    this.config = config;
    this.force = force;
    this.artifacts = {};
  }

  setArtifacts(artifacts) {
    this.artifacts = artifacts;
  }

  getArtifacts() {
    return this.artifacts;
  }

  getInstallCommands(pkg) {
    const scripts = pkg.scripts;
    if (scripts) {
      const cmds = [];
      for (const stage of INSTALL_STAGES) {
        const cmd = scripts[stage];
        if (cmd) {
          cmds.push([stage, cmd]);
        }
      }
      return cmds;
    } else {
      return [];
    }
  }

  walk(loc) {
    var _this = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const files = yield (_fs || _load_fs()).walk(loc, null, new (_set || _load_set()).default(_this.config.registryFolders));
      const mtimes = new (_map || _load_map()).default();
      for (const file of files) {
        mtimes.set(file.relative, file.mtime);
      }
      return mtimes;
    })();
  }

  saveBuildArtifacts(loc, pkg, beforeFiles, spinner) {
    var _this2 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const afterFiles = yield _this2.walk(loc);

      // work out what files have been created/modified
      const buildArtifacts = [];
      for (const _ref of afterFiles) {
        var _ref2 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref, 2);

        const file = _ref2[0];
        const mtime = _ref2[1];

        if (!beforeFiles.has(file) || beforeFiles.get(file) !== mtime) {
          buildArtifacts.push(file);
        }
      }

      if (!buildArtifacts.length) {
        // nothing else to do here since we have no build artifacts
        return;
      }

      // set build artifacts
      const ref = pkg._reference;
      invariant(ref, 'expected reference');
      _this2.artifacts[`${pkg.name}@${pkg.version}`] = buildArtifacts;
    })();
  }

  install(cmds, pkg, spinner) {
    var _this3 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const ref = pkg._reference;
      invariant(ref, 'expected reference');
      const loc = _this3.config.generateHardModulePath(ref);

      try {
        for (const _ref3 of cmds) {
          var _ref4 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref3, 2);

          const stage = _ref4[0];
          const cmd = _ref4[1];

          var _ref5 = yield (0, (_executeLifecycleScript || _load_executeLifecycleScript()).default)(stage, _this3.config, loc, cmd, spinner);

          const stdout = _ref5.stdout;

          _this3.reporter.verbose(stdout);
        }
      } catch (err) {
        err.message = `${loc}: ${err.message}`;

        invariant(ref, 'expected reference');

        if (ref.optional) {
          ref.ignore = true;
          ref.incompatible = true;
          _this3.reporter.warn(_this3.reporter.lang('optionalModuleScriptFail', err.message));
          _this3.reporter.info(_this3.reporter.lang('optionalModuleFail'));

          // Cleanup node_modules
          try {
            yield (_fs || _load_fs()).unlink(loc);
          } catch (e) {
            _this3.reporter.error(_this3.reporter.lang('optionalModuleCleanupFail', e.message));
          }
        } else {
          throw err;
        }
      }
    })();
  }

  packageCanBeInstalled(pkg) {
    const cmds = this.getInstallCommands(pkg);
    if (!cmds.length) {
      return false;
    }
    const ref = pkg._reference;
    invariant(ref, 'Missing package reference');
    if (!ref.fresh && !this.force) {
      // this package hasn't been touched
      return false;
    }

    // we haven't actually written this module out
    if (ref.ignore) {
      return false;
    }
    return true;
  }

  runCommand(spinner, pkg) {
    var _this4 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const cmds = _this4.getInstallCommands(pkg);
      spinner.setPrefix(++_this4.installed, pkg.name);
      yield _this4.install(cmds, pkg, spinner);
    })();
  }

  // detect if there is a circularDependency in the dependency tree
  detectCircularDependencies(root, seenManifests, pkg) {
    const ref = pkg._reference;
    invariant(ref, 'expected reference');

    const deps = ref.dependencies;
    for (const dep of deps) {
      const pkgDep = this.resolver.getStrictResolvedPattern(dep);
      if (seenManifests.has(pkgDep)) {
        // there is a cycle but not with the root
        continue;
      }
      seenManifests.add(pkgDep);
      // found a dependency pointing to root
      if (pkgDep == root) {
        return true;
      }
      if (this.detectCircularDependencies(root, seenManifests, pkgDep)) {
        return true;
      }
    }
    return false;
  }

  // find the next package to be installed
  findInstallablePackage(workQueue, installed) {
    for (const pkg of workQueue) {
      const ref = pkg._reference;
      invariant(ref, 'expected reference');
      const deps = ref.dependencies;

      let dependenciesFullfilled = true;
      for (const dep of deps) {
        const pkgDep = this.resolver.getStrictResolvedPattern(dep);
        if (!installed.has(pkgDep)) {
          dependenciesFullfilled = false;
          break;
        }
      }

      // all depedencies are installed
      if (dependenciesFullfilled) {
        return pkg;
      }

      // detect circular dependency, mark this pkg as installable to break the circle
      if (this.detectCircularDependencies(pkg, new (_set || _load_set()).default(), pkg)) {
        return pkg;
      }
    }
    return null;
  }

  worker(spinner, workQueue, installed, waitQueue) {
    var _this5 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      while (true) {
        // No more work to be done
        if (workQueue.size == 0) {
          break;
        }

        // find a installable package
        const pkg = _this5.findInstallablePackage(workQueue, installed);

        // can't find a package to install, register into waitQueue
        if (pkg == null) {
          spinner.clear();
          yield new (_promise || _load_promise()).default(function (resolve) {
            return waitQueue.add(resolve);
          });
          continue;
        }

        // found a package to install
        workQueue.delete(pkg);
        if (_this5.packageCanBeInstalled(pkg)) {
          yield _this5.runCommand(spinner, pkg);
        }
        installed.add(pkg);
        for (const workerResolve of waitQueue) {
          workerResolve();
        }
        waitQueue.clear();
      }
    })();
  }

  init(seedPatterns) {
    var _this6 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const workQueue = new (_set || _load_set()).default();
      const installed = new (_set || _load_set()).default();
      const pkgs = _this6.resolver.getTopologicalManifests(seedPatterns);
      let installablePkgs = 0;
      // A map to keep track of what files exist before installation
      const beforeFilesMap = new (_map || _load_map()).default();
      for (const pkg of pkgs) {
        if (_this6.packageCanBeInstalled(pkg)) {
          const ref = pkg._reference;
          invariant(ref, 'expected reference');
          const loc = _this6.config.generateHardModulePath(ref);
          beforeFilesMap.set(loc, (yield _this6.walk(loc)));
          installablePkgs += 1;
        }
        workQueue.add(pkg);
      }

      // waitQueue acts like a semaphore to allow workers to register to be notified
      // when there are more work added to the work queue
      const waitQueue = new (_set || _load_set()).default();
      const workers = [];

      const set = _this6.reporter.activitySet(installablePkgs, Math.min(_this6.config.childConcurrency, workQueue.size));

      for (const spinner of set.spinners) {
        workers.push(_this6.worker(spinner, workQueue, installed, waitQueue));
      }

      yield (_promise || _load_promise()).default.all(workers);

      // cache all build artifacts
      for (const pkg of pkgs) {
        if (_this6.packageCanBeInstalled(pkg)) {
          const ref = pkg._reference;
          invariant(ref, 'expected reference');
          const loc = _this6.config.generateHardModulePath(ref);
          const beforeFiles = beforeFilesMap.get(loc);
          invariant(beforeFiles, 'files before installation should always be recorded');
          yield _this6.saveBuildArtifacts(loc, pkg, beforeFiles, set.spinners[0]);
        }
      }

      set.end();
    })();
  }
}
exports.default = PackageInstallScripts;