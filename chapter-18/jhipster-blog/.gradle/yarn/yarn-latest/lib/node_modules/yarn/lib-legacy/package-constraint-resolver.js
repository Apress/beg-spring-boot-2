'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const semver = require('semver');

// This isn't really a "proper" constraint resolver. We just return the highest semver
// version in the versions passed that satisfies the input range. This vastly reduces
// the complexity and is very efficient for package resolution.

class PackageConstraintResolver {
  constructor(config, reporter) {
    this.reporter = reporter;
    this.config = config;
  }

  reduce(versions, range) {
    if (range === 'latest') {
      // Usually versions are already ordered and the last one is the latest
      return (_promise || _load_promise()).default.resolve(versions[versions.length - 1]);
    } else {
      return (_promise || _load_promise()).default.resolve(semver.maxSatisfying(versions, range, this.config.looseSemver));
    }
  }
}
exports.default = PackageConstraintResolver;