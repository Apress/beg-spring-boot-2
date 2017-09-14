'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.pack = undefined;

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let pack = exports.pack = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, dir) {
    const pkg = yield config.readRootManifest();
    const bundledDependencies = pkg.bundledDependencies,
          main = pkg.main,
          onlyFiles = pkg.files;

    // include required files

    let filters = NEVER_IGNORE.slice();
    // include default filters unless `files` is used
    if (!onlyFiles) {
      filters = filters.concat(DEFAULT_IGNORE);
    }
    if (main) {
      filters = filters.concat((0, (_filter || _load_filter()).ignoreLinesToRegex)(['!/' + main]));
    }

    // include bundledDependencies
    if (bundledDependencies) {
      const folder = config.getFolder(pkg);
      filters = (0, (_filter || _load_filter()).ignoreLinesToRegex)(bundledDependencies.map(function (name) {
        return `!${folder}/${name}`;
      }), '.');
    }

    // `files` field
    if (onlyFiles) {
      let lines = ['*', // ignore all files except those that are explicitly included with a negation filter
      '.*'];
      lines = lines.concat(onlyFiles.map(function (filename) {
        return `!${filename}`;
      }), onlyFiles.map(function (filename) {
        return `!${path.join(filename, '**')}`;
      }));
      const regexes = (0, (_filter || _load_filter()).ignoreLinesToRegex)(lines, '.');
      filters = filters.concat(regexes);
    }

    //
    const files = yield (_fs || _load_fs()).walk(config.cwd, null, new Set(FOLDERS_IGNORE));

    // create ignores
    for (const file of files) {
      if (IGNORE_FILENAMES.indexOf(path.basename(file.relative)) >= 0) {
        const raw = yield (_fs || _load_fs()).readFile(file.absolute);
        const lines = raw.split('\n');

        const regexes = (0, (_filter || _load_filter()).ignoreLinesToRegex)(lines, path.dirname(file.relative));
        filters = filters.concat(regexes);
      }
    }

    // files to definitely keep, takes precedence over ignore filter
    const keepFiles = new Set();

    // files to definitely ignore
    const ignoredFiles = new Set();

    // list of files that didn't match any of our patterns, if a directory in the chain above was matched
    // then we should inherit it
    const possibleKeepFiles = new Set();

    // apply filters
    (0, (_filter || _load_filter()).sortFilter)(files, filters, keepFiles, possibleKeepFiles, ignoredFiles);

    const packer = tar.pack(config.cwd, {
      ignore: function (name) {
        const relative = path.relative(config.cwd, name);
        // Don't ignore directories, since we need to recurse inside them to check for unignored files.
        if (fs2.lstatSync(name).isDirectory()) {
          const isParentOfKeptFile = Array.from(keepFiles).some(function (name) {
            return !path.relative(relative, name).startsWith('..');
          });
          return !isParentOfKeptFile;
        }
        // Otherwise, ignore a file if we're not supposed to keep it.
        return !keepFiles.has(relative);
      },
      map: function (header) {
        const suffix = header.name === '.' ? '' : `/${header.name}`;
        header.name = `package${suffix}`;
        delete header.uid;
        delete header.gid;
        return header;
      }
    });

    const compressor = packer.pipe(new zlib.Gzip());

    return compressor;
  });

  return function pack(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let run = exports.run = (() => {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    const pkg = yield config.readRootManifest();
    if (!pkg.name) {
      throw new (_errors || _load_errors()).MessageError(reporter.lang('noName'));
    }
    if (!pkg.version) {
      throw new (_errors || _load_errors()).MessageError(reporter.lang('noVersion'));
    }

    const normaliseScope = function (name) {
      return name[0] === '@' ? name.substr(1).replace('/', '-') : name;
    };
    const filename = flags.filename || path.join(config.cwd, `${normaliseScope(pkg.name)}-v${pkg.version}.tgz`);

    const stream = yield pack(config, config.cwd);

    yield new Promise(function (resolve, reject) {
      stream.pipe(fs2.createWriteStream(filename));
      stream.on('error', reject);
      stream.on('close', resolve);
    });

    reporter.success(reporter.lang('packWroteTarball', filename));
  });

  return function run(_x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
})();

exports.setFlags = setFlags;
exports.hasWrapper = hasWrapper;

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

var _filter;

function _load_filter() {
  return _filter = require('../../util/filter.js');
}

var _errors;

function _load_errors() {
  return _errors = require('../../errors.js');
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const zlib = require('zlib');
const path = require('path');
const tar = require('tar-fs');
const fs2 = require('fs');

const IGNORE_FILENAMES = ['.yarnignore', '.npmignore', '.gitignore'];

const FOLDERS_IGNORE = [
// never allow version control folders
'.git', 'CVS', '.svn', '.hg', 'node_modules'];

const DEFAULT_IGNORE = (0, (_filter || _load_filter()).ignoreLinesToRegex)([...FOLDERS_IGNORE,

// ignore cruft
'yarn.lock', '.lock-wscript', '.wafpickle-{0..9}', '*.swp', '._*', 'npm-debug.log', 'yarn-error.log', '.npmrc', '.yarnrc', '.npmignore', '.gitignore', '.DS_Store']);

const NEVER_IGNORE = (0, (_filter || _load_filter()).ignoreLinesToRegex)([
// never ignore these files
'!/package.json', '!/readme*', '!/+(license|licence)*', '!/+(changes|changelog|history)*']);

function setFlags(commander) {
  commander.option('-f, --filename <filename>', 'filename');
}

function hasWrapper() {
  return true;
}