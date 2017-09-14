'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _errors;

function _load_errors() {
  return _errors = require('../errors.js');
}

var _baseFetcher;

function _load_baseFetcher() {
  return _baseFetcher = _interopRequireDefault(require('./base-fetcher.js'));
}

var _git;

function _load_git() {
  return _git = _interopRequireDefault(require('../util/git.js'));
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../util/fs.js'));
}

var _constants;

function _load_constants() {
  return _constants = _interopRequireWildcard(require('../constants.js'));
}

var _crypto;

function _load_crypto() {
  return _crypto = _interopRequireWildcard(require('../util/crypto.js'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tarFs = require('tar-fs');
const url = require('url');
const path = require('path');
const fs = require('fs');

const invariant = require('invariant');

class GitFetcher extends (_baseFetcher || _load_baseFetcher()).default {
  getLocalAvailabilityStatus() {
    var _this = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      // Some mirrors might still have files named "./reponame" instead of "./reponame-commit"
      const tarballLegacyMirrorPath = _this.getTarballMirrorPath({ withCommit: false });
      const tarballModernMirrorPath = _this.getTarballMirrorPath();
      const tarballCachePath = _this.getTarballCachePath();

      if (tarballLegacyMirrorPath != null && (yield (_fs || _load_fs()).exists(tarballLegacyMirrorPath))) {
        return true;
      }

      if (tarballModernMirrorPath != null && (yield (_fs || _load_fs()).exists(tarballModernMirrorPath))) {
        return true;
      }

      if (yield (_fs || _load_fs()).exists(tarballCachePath)) {
        return true;
      }

      return false;
    })();
  }

  getTarballMirrorPath() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$withCommit = _ref.withCommit;

    let withCommit = _ref$withCommit === undefined ? true : _ref$withCommit;

    var _url$parse = url.parse(this.reference);

    const pathname = _url$parse.pathname;


    if (pathname == null) {
      return null;
    }

    const hash = this.hash;

    const packageFilename = withCommit && hash ? `${path.basename(pathname)}-${hash}` : `${path.basename(pathname)}`;

    return this.config.getOfflineMirrorPath(packageFilename);
  }

  getTarballCachePath() {
    return path.join(this.dest, (_constants || _load_constants()).TARBALL_FILENAME);
  }

  fetchFromLocal(override) {
    var _this2 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const tarballLegacyMirrorPath = _this2.getTarballMirrorPath({ withCommit: false });
      const tarballModernMirrorPath = _this2.getTarballMirrorPath();
      const tarballCachePath = _this2.getTarballCachePath();

      const tarballMirrorPath = tarballModernMirrorPath && !(yield (_fs || _load_fs()).exists(tarballModernMirrorPath)) && tarballLegacyMirrorPath && (yield (_fs || _load_fs()).exists(tarballLegacyMirrorPath)) ? tarballLegacyMirrorPath : tarballModernMirrorPath;

      const tarballPath = override || tarballMirrorPath || tarballCachePath;

      if (!tarballPath || !(yield (_fs || _load_fs()).exists(tarballPath))) {
        throw new (_errors || _load_errors()).MessageError(_this2.reporter.lang('tarballNotInNetworkOrCache', _this2.reference, tarballPath));
      }

      return new (_promise || _load_promise()).default(function (resolve, reject) {
        const untarStream = tarFs.extract(_this2.dest, {
          dmode: 0o555, // all dirs should be readable
          fmode: 0o444, // all files should be readable
          chown: false });

        const hashStream = new (_crypto || _load_crypto()).HashStream();

        const cachedStream = fs.createReadStream(tarballPath);
        cachedStream.pipe(hashStream).pipe(untarStream).on('finish', function () {
          const expectHash = _this2.hash;
          const actualHash = hashStream.getHash();
          if (!expectHash || expectHash === actualHash) {
            resolve({
              hash: actualHash
            });
          } else {
            reject(new (_errors || _load_errors()).SecurityError(_this2.reporter.lang('fetchBadHash', expectHash, actualHash)));
          }
        }).on('error', function (err) {
          reject(new (_errors || _load_errors()).MessageError(this.reporter.lang('fetchErrorCorrupt', err.message, tarballPath)));
        });
      });
    })();
  }

  fetchFromExternal() {
    var _this3 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      const hash = _this3.hash;
      invariant(hash, 'Commit hash required');

      const gitUrl = (_git || _load_git()).default.npmUrlToGitUrl(_this3.reference);
      const git = new (_git || _load_git()).default(_this3.config, gitUrl, hash);
      yield git.init();
      yield git.clone(_this3.dest);

      const tarballMirrorPath = _this3.getTarballMirrorPath();
      const tarballCachePath = _this3.getTarballCachePath();

      if (tarballMirrorPath) {
        yield git.archive(tarballMirrorPath);
      }

      if (tarballCachePath) {
        yield git.archive(tarballCachePath);
      }

      return {
        hash: hash
      };
    })();
  }

  _fetch() {
    var _this4 = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      if (yield _this4.getLocalAvailabilityStatus()) {
        return _this4.fetchFromLocal();
      } else {
        return _this4.fetchFromExternal();
      }
    })();
  }
}
exports.default = GitFetcher;