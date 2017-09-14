'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.requireLockfile = undefined;

var _from;

function _load_from() {
  return _from = _interopRequireDefault(require('babel-runtime/core-js/array/from'));
}

var _keys;

function _load_keys() {
  return _keys = _interopRequireDefault(require('babel-runtime/core-js/object/keys'));
}

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _set;

function _load_set() {
  return _set = _interopRequireDefault(require('babel-runtime/core-js/set'));
}

var _slicedToArray2;

function _load_slicedToArray() {
  return _slicedToArray2 = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let cleanQuery = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, query) {
    // if a location was passed then turn it into a hash query
    if (path.isAbsolute(query) && (yield (_fs || _load_fs()).exists(query))) {
      // absolute path
      query = path.relative(config.cwd, query);
    }

    // remove references to node_modules with hashes
    query = query.replace(/([\\/]|^)node_modules[\\/]/g, '#');

    // remove trailing hashes
    query = query.replace(/^#+/g, '');

    // remove trailing paths from each part of the query, skip second part of path for scoped packages
    let queryParts = query.split('#');
    queryParts = queryParts.map(function (part) {
      let parts = part.split(/[\\/]/g);

      if (part[0] === '@') {
        parts = parts.slice(0, 2);
      } else {
        parts = parts.slice(0, 1);
      }

      return parts.join('/');
    });
    query = queryParts.join('#');

    return query;
  });

  return function cleanQuery(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getPackageSize = (() => {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (tuple) {
    var _tuple = (0, (_slicedToArray2 || _load_slicedToArray()).default)(tuple, 1);

    const loc = _tuple[0];


    const files = yield (_fs || _load_fs()).walk(loc, null, new (_set || _load_set()).default([(_constants || _load_constants()).METADATA_FILENAME, (_constants || _load_constants()).TARBALL_FILENAME]));

    const sizes = yield (_promise || _load_promise()).default.all(files.map(function (walkFile) {
      return (_fs || _load_fs()).getFileSizeOnDisk(walkFile.absolute);
    }));

    return sum(sizes);
  });

  return function getPackageSize(_x3) {
    return _ref2.apply(this, arguments);
  };
})();

let run = exports.run = (() => {
  var _ref6 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    if (!args.length) {
      throw new (_errors || _load_errors()).MessageError(reporter.lang('missingWhyDependency'));
    }
    if (args.length > 1) {
      throw new (_errors || _load_errors()).MessageError(reporter.lang('tooManyArguments', 1));
    }

    const query = yield cleanQuery(config, args[0]);

    reporter.step(1, 4, reporter.lang('whyStart', args[0]), emoji.get('thinking_face'));

    // init
    reporter.step(2, 4, reporter.lang('whyInitGraph'), emoji.get('truck'));
    const lockfile = yield (_wrapper || _load_wrapper()).default.fromDirectory(config.cwd, reporter);
    const install = new (_install || _load_install()).Install(flags, config, reporter, lockfile);

    var _ref7 = yield install.fetchRequestFromCwd();

    const depRequests = _ref7.requests,
          patterns = _ref7.patterns;

    yield install.resolver.init(depRequests, install.flags.flat);
    const hoisted = yield install.linker.getFlatHoistedTree(patterns);

    // finding
    reporter.step(3, 4, reporter.lang('whyFinding'), emoji.get('mag'));

    let match;
    for (const _ref8 of hoisted) {
      var _ref9 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref8, 2);

      const loc = _ref9[0];
      const info = _ref9[1];

      if (info.key === query || info.previousKeys.indexOf(query) >= 0) {
        match = [loc, info];
        break;
      }
    }

    if (!match) {
      reporter.error(reporter.lang('whyUnknownMatch'));
      return;
    }

    var _match = match,
        _match2 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_match, 2);

    const matchInfo = _match2[1];

    const matchRef = matchInfo.pkg._reference;
    invariant(matchRef, 'expected reference');

    const matchPatterns = matchRef.patterns;
    const matchRequests = matchRef.requests;

    const reasons = [];
    // reason: dependency of these modules
    for (const request of matchRequests) {
      const parentRequest = request.parentRequest;
      if (!parentRequest) {
        continue;
      }

      const dependent = install.resolver.getResolvedPattern(parentRequest.pattern);
      if (!dependent) {
        continue;
      }

      const chain = [];

      let delegator = parentRequest;
      do {
        chain.push(install.resolver.getStrictResolvedPattern(delegator.pattern).name);
      } while (delegator = delegator.parentRequest);

      reasons.push({
        type: 'whyDependedOn',
        typeSimple: 'whyDependedOnSimple',
        value: chain.reverse().join('#')
      });
    }

    // reason: exists in manifest
    let rootType;
    for (const pattern of matchPatterns) {
      rootType = install.rootPatternsToOrigin[pattern];
      if (rootType) {
        reasons.push({
          type: 'whySpecified',
          typeSimple: 'whySpecifiedSimple',
          value: rootType
        });
      }
    }

    // reason: this is hoisted from these modules
    for (const pattern of matchInfo.previousKeys) {
      if (pattern !== matchInfo.key) {
        reasons.push({
          type: 'whyHoistedFrom',
          typeSimple: 'whyHoistedFromSimple',
          value: pattern
        });
      }
    }

    // package sizes
    reporter.step(4, 4, reporter.lang('whyCalculating'), emoji.get('aerial_tramway'));

    let packageSize = 0;
    let directSizes = [];
    let transitiveSizes = [];
    try {
      packageSize = yield getPackageSize(match);
    } catch (e) {}

    const dependencies = (0, (_from || _load_from()).default)(collect(hoisted, new (_set || _load_set()).default(), match));
    const transitiveDependencies = (0, (_from || _load_from()).default)(collect(hoisted, new (_set || _load_set()).default(), match, { recursive: true }));

    try {
      directSizes = yield (_promise || _load_promise()).default.all(dependencies.map(getPackageSize));
      transitiveSizes = yield (_promise || _load_promise()).default.all(transitiveDependencies.map(getPackageSize));
    } catch (e) {}

    const transitiveKeys = new (_set || _load_set()).default(transitiveDependencies.map(function (_ref10) {
      var _ref11 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref10, 2);

      let info = _ref11[1];
      return info.key;
    }));
    const sharedDependencies = getSharedDependencies(hoisted, transitiveKeys);

    //
    // reason: hoisted
    if (query === matchInfo.originalKey) {
      reporter.info(reporter.lang('whyHoistedTo', matchInfo.key));
    }

    if (reasons.length === 1) {
      reporter.info(reporter.lang(reasons[0].typeSimple, reasons[0].value));
    } else if (reasons.length > 1) {
      reporter.info(reporter.lang('whyReasons'));
      reporter.list('reasons', reasons.map(function (reason) {
        return reporter.lang(reason.type, reason.value);
      }));
    } else {
      reporter.error(reporter.lang('whyWhoKnows'));
    }

    if (packageSize) {
      // stats: file size of this dependency without any dependencies
      reporter.info(reporter.lang('whyDiskSizeWithout', bytes(packageSize)));

      // stats: file size of this dependency including dependencies that aren't shared
      reporter.info(reporter.lang('whyDiskSizeUnique', bytes(packageSize + sum(directSizes))));

      // stats: file size of this dependency including dependencies
      reporter.info(reporter.lang('whyDiskSizeTransitive', bytes(packageSize + sum(transitiveSizes))));

      // stats: shared transitive dependencies
      reporter.info(reporter.lang('whySharedDependencies', sharedDependencies.size));
    }
  });

  return function run(_x5, _x6, _x7, _x8) {
    return _ref6.apply(this, arguments);
  };
})();

exports.setFlags = setFlags;
exports.hasWrapper = hasWrapper;

var _install;

function _load_install() {
  return _install = require('./install.js');
}

var _constants;

function _load_constants() {
  return _constants = require('../../constants.js');
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

var _wrapper;

function _load_wrapper() {
  return _wrapper = _interopRequireDefault(require('../../lockfile/wrapper.js'));
}

var _errors;

function _load_errors() {
  return _errors = require('../../errors.js');
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const requireLockfile = exports.requireLockfile = true;

const invariant = require('invariant');
const bytes = require('bytes');
const emoji = require('node-emoji');
const path = require('path');

function sum(array) {
  return array.length ? array.reduce((a, b) => a + b, 0) : 0;
}

function collect(hoistManifests, allDependencies, dependency) {
  var _ref3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { recursive: false };

  let recursive = _ref3.recursive;

  var _dependency = (0, (_slicedToArray2 || _load_slicedToArray()).default)(dependency, 2);

  const depInfo = _dependency[1];

  const deps = depInfo.pkg.dependencies;

  if (!deps) {
    return allDependencies;
  }

  const dependencyKeys = new (_set || _load_set()).default((0, (_keys || _load_keys()).default)(deps));
  const directDependencies = [];

  for (const dep of hoistManifests) {
    var _dep = (0, (_slicedToArray2 || _load_slicedToArray()).default)(dep, 2);

    const info = _dep[1];


    if (!allDependencies.has(dep) && dependencyKeys.has(info.key)) {
      allDependencies.add(dep);
      directDependencies.push(dep);
    }
  }

  if (recursive) {
    directDependencies.forEach(dependency => collect(hoistManifests, allDependencies, dependency, { recursive: true }));
  }

  return allDependencies;
}

function getSharedDependencies(hoistManifests, transitiveKeys) {
  const sharedDependencies = new (_set || _load_set()).default();
  for (const _ref4 of hoistManifests) {
    var _ref5 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref4, 2);

    const info = _ref5[1];

    if (!transitiveKeys.has(info.key) && info.pkg.dependencies) {
      (0, (_keys || _load_keys()).default)(info.pkg.dependencies).forEach(dependency => {
        if (transitiveKeys.has(dependency) && !sharedDependencies.has(dependency)) {
          sharedDependencies.add(dependency);
        }
      });
    }
  }
  return sharedDependencies;
}

function setFlags() {}

function hasWrapper() {
  return true;
}