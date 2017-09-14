'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.buildTree = exports.requireLockfile = undefined;

var _slicedToArray2;

function _load_slicedToArray() {
  return _slicedToArray2 = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let buildTree = exports.buildTree = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (resolver, linker, patterns, opts, onlyFresh, ignoreHoisted) {
    const treesByKey = {};
    const trees = [];
    const hoisted = yield linker.getFlatHoistedTree(patterns);

    const hoistedByKey = {};
    for (const _ref2 of hoisted) {
      var _ref3 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref2, 2);

      const key = _ref3[0];
      const info = _ref3[1];

      hoistedByKey[key] = info;
    }

    // build initial trees
    for (const _ref4 of hoisted) {
      var _ref5 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref4, 2);

      const info = _ref5[1];

      const ref = info.pkg._reference;
      const hint = null;
      const parent = getParent(info.key, treesByKey);
      const children = [];
      let depth = 0;
      let color = 'bold';
      invariant(ref, 'expected reference');

      if (onlyFresh) {
        let isFresh = false;
        for (const pattern of ref.patterns) {
          if (resolver.isNewPattern(pattern)) {
            isFresh = true;
            break;
          }
        }
        if (!isFresh) {
          continue;
        }
      }

      if (info.originalKey !== info.key || opts.reqDepth === 0) {
        // was hoisted
        color = null;
      }
      // check parent to obtain next depth
      if (parent && parent.depth > 0) {
        depth = parent.depth + 1;
      } else {
        depth = 0;
      }

      const topLevel = opts.reqDepth === 0 && !parent;
      const showAll = opts.reqDepth === -1;
      const nextDepthIsValid = depth + 1 <= Number(opts.reqDepth);

      if (topLevel || nextDepthIsValid || showAll) {
        treesByKey[info.key] = {
          name: `${info.pkg.name}@${info.pkg.version}`,
          children,
          hint,
          color,
          depth
        };
      }

      // add in dummy children for hoisted dependencies
      const nextChildDepthIsValid = depth + 1 < Number(opts.reqDepth);
      invariant(ref, 'expected reference');
      if (!ignoreHoisted && nextDepthIsValid || showAll) {
        for (const pattern of resolver.dedupePatterns(ref.dependencies)) {
          const pkg = resolver.getStrictResolvedPattern(pattern);

          if (!hoistedByKey[`${info.key}#${pkg.name}`] && (nextChildDepthIsValid || showAll)) {
            children.push({
              name: pattern,
              color: 'dim',
              shadow: true
            });
          }
        }
      }
    }

    // add children
    for (const _ref6 of hoisted) {
      var _ref7 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref6, 2);

      const info = _ref7[1];

      const tree = treesByKey[info.key];
      const parent = getParent(info.key, treesByKey);
      if (!tree) {
        continue;
      }

      if (info.key.split('#').length === 1) {
        trees.push(tree);
        continue;
      }

      if (parent) {
        parent.children.push(tree);
      }
    }

    return { trees, count: buildCount(trees) };
  });

  return function buildTree(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
})();

let run = exports.run = (() => {
  var _ref8 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {

    const lockfile = yield (_wrapper || _load_wrapper()).default.fromDirectory(config.cwd, reporter);
    const install = new (_install || _load_install()).Install(flags, config, reporter, lockfile);

    var _ref9 = yield install.fetchRequestFromCwd();

    const depRequests = _ref9.requests,
          patterns = _ref9.patterns;

    yield install.resolver.init(depRequests, install.flags.flat);

    const opts = {
      reqDepth: getReqDepth(flags.depth)
    };

    var _ref10 = yield buildTree(install.resolver, install.linker, patterns, opts);

    let trees = _ref10.trees;


    if (args.length) {
      trees = trees.filter(function (tree) {
        return filterTree(tree, args);
      });
    }

    reporter.tree('list', trees);
  });

  return function run(_x7, _x8, _x9, _x10) {
    return _ref8.apply(this, arguments);
  };
})();

exports.getParent = getParent;
exports.hasWrapper = hasWrapper;
exports.setFlags = setFlags;
exports.getReqDepth = getReqDepth;
exports.filterTree = filterTree;

var _install;

function _load_install() {
  return _install = require('./install.js');
}

var _wrapper;

function _load_wrapper() {
  return _wrapper = _interopRequireDefault(require('../../lockfile/wrapper.js'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const invariant = require('invariant');

const requireLockfile = exports.requireLockfile = true;

function buildCount(trees) {
  if (!trees || !trees.length) {
    return 0;
  }

  let count = 0;

  for (const tree of trees) {
    if (tree.shadow) {
      continue;
    }

    count++;
    count += buildCount(tree.children);
  }

  return count;
}

function getParent(key, treesByKey) {
  const parentKey = key.split('#').slice(0, -1).join('#');
  return treesByKey[parentKey];
}

function hasWrapper() {
  return true;
}

function setFlags(commander) {
  commander.option('--depth [depth]', 'Limit the depth of the shown dependencies');
}

function getReqDepth(inputDepth) {
  return inputDepth && /^\d+$/.test(inputDepth) ? Number(inputDepth) : -1;
}

function filterTree(tree, filters) {
  if (tree.children) {
    tree.children = tree.children.filter(child => filterTree(child, filters));
  }

  const notDim = tree.color !== 'dim';
  const found = filters.indexOf(tree.name.slice(0, tree.name.lastIndexOf('@'))) > -1;
  const hasChildren = tree.children == null ? false : tree.children.length > 0;

  return notDim && (found || hasChildren);
}