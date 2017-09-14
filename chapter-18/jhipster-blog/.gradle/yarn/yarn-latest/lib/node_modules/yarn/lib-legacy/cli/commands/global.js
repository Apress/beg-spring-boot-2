'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = undefined;

var _set;

function _load_set() {
  return _set = _interopRequireDefault(require('babel-runtime/core-js/set'));
}

var _keys;

function _load_keys() {
  return _keys = _interopRequireDefault(require('babel-runtime/core-js/object/keys'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

let updateCwd = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config) {
    yield config.init({
      cwd: config.globalFolder,
      binLinks: true,
      globalFolder: config.globalFolder,
      cacheFolder: config._cacheRootFolder,
      linkFolder: config.linkFolder
    });
  });

  return function updateCwd(_x) {
    return _ref.apply(this, arguments);
  };
})();

let getBins = (() => {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config) {
    // build up list of registry folders to search for binaries
    const dirs = [];
    for (const registryName of (0, (_keys || _load_keys()).default)((_index || _load_index()).registries)) {
      const registry = config.registries[registryName];
      dirs.push(registry.loc);
    }

    // build up list of binary files
    const paths = new (_set || _load_set()).default();
    for (const dir of dirs) {
      const binDir = path.join(dir, '.bin');
      if (!(yield (_fs || _load_fs()).exists(binDir))) {
        continue;
      }

      for (const name of yield (_fs || _load_fs()).readdir(binDir)) {
        paths.add(path.join(binDir, name));
      }
    }
    return paths;
  });

  return function getBins(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

let initUpdateBins = (() => {
  var _ref3 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags) {
    const beforeBins = yield getBins(config);
    const binFolder = getBinFolder(config, flags);

    function throwPermError(err, dest) {
      if (err.code === 'EACCES') {
        throw new (_errors || _load_errors()).MessageError(reporter.lang('noFilePermission', dest));
      } else {
        throw err;
      }
    }

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const afterBins = yield getBins(config);

      // remove old bins
      for (const src of beforeBins) {
        if (afterBins.has(src)) {
          // not old
          continue;
        }

        // remove old bin
        const dest = path.join(binFolder, path.basename(src));
        try {
          yield (_fs || _load_fs()).unlink(dest);
        } catch (err) {
          throwPermError(err, dest);
        }
      }

      // add new bins
      for (const src of afterBins) {
        if (beforeBins.has(src)) {
          // already inserted
          continue;
        }

        // insert new bin
        const dest = path.join(binFolder, path.basename(src));
        try {
          yield (_fs || _load_fs()).unlink(dest);
          yield (0, (_packageLinker || _load_packageLinker()).linkBin)(src, dest);
          if (process.platform === 'win32' && dest.indexOf('.cmd') !== -1) {
            yield (_fs || _load_fs()).rename(dest + '.cmd', dest);
          }
        } catch (err) {
          throwPermError(err, dest);
        }
      }
    });
  });

  return function initUpdateBins(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
})();

exports.hasWrapper = hasWrapper;
exports.getBinFolder = getBinFolder;
exports.setFlags = setFlags;

var _errors;

function _load_errors() {
  return _errors = require('../../errors.js');
}

var _index;

function _load_index() {
  return _index = require('../../registries/index.js');
}

var _baseReporter;

function _load_baseReporter() {
  return _baseReporter = _interopRequireDefault(require('../../reporters/base-reporter.js'));
}

var _buildSubCommands2;

function _load_buildSubCommands() {
  return _buildSubCommands2 = _interopRequireDefault(require('./_build-sub-commands.js'));
}

var _wrapper;

function _load_wrapper() {
  return _wrapper = _interopRequireDefault(require('../../lockfile/wrapper.js'));
}

var _install;

function _load_install() {
  return _install = require('./install.js');
}

var _add;

function _load_add() {
  return _add = require('./add.js');
}

var _remove;

function _load_remove() {
  return _remove = require('./remove.js');
}

var _upgrade;

function _load_upgrade() {
  return _upgrade = require('./upgrade.js');
}

var _upgradeInteractive;

function _load_upgradeInteractive() {
  return _upgradeInteractive = require('./upgrade-interactive.js');
}

var _packageLinker;

function _load_packageLinker() {
  return _packageLinker = require('../../package-linker.js');
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GlobalAdd extends (_add || _load_add()).Add {
  maybeOutputSaveTree() {
    for (const pattern of this.addedPatterns) {
      const manifest = this.resolver.getStrictResolvedPattern(pattern);
      _ls(manifest, this.reporter, true);
    }
    return (_promise || _load_promise()).default.resolve();
  }

  _logSuccessSaveLockfile() {
    // noop
  }
}

const path = require('path');

function hasWrapper(flags, args) {
  return args[0] !== 'bin';
}

function getGlobalPrefix(config, flags) {
  if (flags.prefix) {
    return flags.prefix;
  } else if (config.getOption('prefix')) {
    return String(config.getOption('prefix'));
  } else if (process.env.PREFIX) {
    return process.env.PREFIX;
  } else if (process.platform === 'win32') {
    if (process.env.LOCALAPPDATA) {
      return path.join(process.env.LOCALAPPDATA, 'Yarn', 'bin');
    }
    // c:\node\node.exe --> prefix=c:\node\
    return path.dirname(process.execPath);
  } else {
    // /usr/local/bin/node --> prefix=/usr/local
    let prefix = path.dirname(path.dirname(process.execPath));

    // destdir only is respected on Unix
    if (process.env.DESTDIR) {
      prefix = path.join(process.env.DESTDIR, prefix);
    }

    return prefix;
  }
}

function getBinFolder(config, flags) {
  const prefix = getGlobalPrefix(config, flags);
  if (process.platform === 'win32') {
    return prefix;
  } else {
    return path.resolve(prefix, 'bin');
  }
}

function _ls(manifest, reporter, saved) {
  const bins = manifest.bin ? (0, (_keys || _load_keys()).default)(manifest.bin) : [];
  const human = `${manifest.name}@${manifest.version}`;
  if (bins.length) {
    if (saved) {
      reporter.success(reporter.lang('packageInstalledWithBinaries', human));
    } else {
      reporter.info(reporter.lang('packageHasBinaries', human));
    }
    reporter.list(`bins-${manifest.name}`, bins);
  } else if (saved) {
    reporter.warn(reporter.lang('packageHasNoBinaries', human));
  }
}

var _buildSubCommands = (0, (_buildSubCommands2 || _load_buildSubCommands()).default)('global', {
  add: (() => {
    var _ref5 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
      yield updateCwd(config);

      const updateBins = yield initUpdateBins(config, reporter, flags);
      if (args.indexOf('yarn') !== -1) {
        reporter.warn(reporter.lang('packageContainsYarnAsGlobal'));
      }

      // install module
      const lockfile = yield (_wrapper || _load_wrapper()).default.fromDirectory(config.cwd);
      const install = new GlobalAdd(args, flags, config, reporter, lockfile);
      yield install.init();

      // link binaries
      yield updateBins();
    });

    function add(_x6, _x7, _x8, _x9) {
      return _ref5.apply(this, arguments);
    }

    return add;
  })(),
  bin: function bin(config, reporter, flags, args) {
    reporter.log(getBinFolder(config, flags));
  },
  ls: (() => {
    var _ref6 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
      yield updateCwd(config);

      // install so we get hard file paths
      const lockfile = yield (_wrapper || _load_wrapper()).default.fromDirectory(config.cwd);
      const install = new (_install || _load_install()).Install({ skipIntegrityCheck: true }, config, new (_baseReporter || _load_baseReporter()).default(), lockfile);
      const patterns = yield install.init();

      // dump global modules
      for (const pattern of patterns) {
        const manifest = install.resolver.getStrictResolvedPattern(pattern);
        _ls(manifest, reporter, false);
      }
    });

    function ls(_x10, _x11, _x12, _x13) {
      return _ref6.apply(this, arguments);
    }

    return ls;
  })(),
  remove: (() => {
    var _ref7 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
      yield updateCwd(config);

      const updateBins = yield initUpdateBins(config, reporter, flags);

      // remove module
      yield (0, (_remove || _load_remove()).run)(config, reporter, flags, args);

      // remove binaries
      yield updateBins();
    });

    function remove(_x14, _x15, _x16, _x17) {
      return _ref7.apply(this, arguments);
    }

    return remove;
  })(),
  upgrade: (() => {
    var _ref8 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
      yield updateCwd(config);

      const updateBins = yield initUpdateBins(config, reporter, flags);

      // upgrade module
      yield (0, (_upgrade || _load_upgrade()).run)(config, reporter, flags, args);

      // update binaries
      yield updateBins();
    });

    function upgrade(_x18, _x19, _x20, _x21) {
      return _ref8.apply(this, arguments);
    }

    return upgrade;
  })(),
  upgradeInteractive: (() => {
    var _ref9 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
      yield updateCwd(config);

      const updateBins = yield initUpdateBins(config, reporter, flags);

      // upgrade module
      yield (0, (_upgradeInteractive || _load_upgradeInteractive()).run)(config, reporter, flags, args);

      // update binaries
      yield updateBins();
    });

    function upgradeInteractive(_x22, _x23, _x24, _x25) {
      return _ref9.apply(this, arguments);
    }

    return upgradeInteractive;
  })()
});

const run = _buildSubCommands.run,
      _setFlags = _buildSubCommands.setFlags;
exports.run = run;
function setFlags(commander) {
  _setFlags(commander);
  commander.option('--prefix <prefix>', 'bin prefix to use to install binaries');
}