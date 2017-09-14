'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGitConfigInfo = exports.run = undefined;

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let run = exports.run = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    const manifests = yield config.getRootManifests();

    let repository = {};
    const author = {
      name: config.getOption('init-author-name'),
      email: config.getOption('init-author-email'),
      url: config.getOption('init-author-url')
    };
    if (yield (_fs || _load_fs()).exists(path.join(config.cwd, '.git'))) {
      // get git origin of the cwd
      try {
        repository = {
          type: 'git',
          url: yield (_child || _load_child()).spawn('git', ['config', 'remote.origin.url'], { cwd: config.cwd })
        };
      } catch (ex) {
        // Ignore - Git repo may not have an origin URL yet (eg. if it only exists locally)
      }

      if (author.name === undefined) {
        author.name = yield getGitConfigInfo('user.name');
      }

      if (author.email === undefined) {
        author.email = yield getGitConfigInfo('user.email');
      }
    }

    const keys = [{
      key: 'name',
      question: 'name',
      default: path.basename(config.cwd),
      validation: (_validate || _load_validate()).isValidPackageName,
      validationError: 'invalidPackageName'
    }, {
      key: 'version',
      question: 'version',
      default: String(config.getOption('init-version'))
    }, {
      key: 'description',
      question: 'description',
      default: ''
    }, {
      key: 'main',
      question: 'entry point',
      default: 'index.js'
    }, {
      key: 'repository',
      question: 'repository url',
      default: (0, (_util || _load_util()).extractRepositoryUrl)(repository)
    }, {
      key: 'author',
      question: 'author',
      default: (0, (_util || _load_util()).stringifyPerson)(author)
    }, {
      key: 'license',
      question: 'license',
      default: String(config.getOption('init-license'))
    }];

    // get answers
    const pkg = {};
    for (const entry of keys) {
      const yes = flags.yes;
      const manifestKey = entry.key;
      let question = entry.question,
          def = entry.default;


      for (const registryName of (_index || _load_index()).registryNames) {
        const object = manifests[registryName].object;

        let val = objectPath.get(object, manifestKey);
        if (!val) {
          break;
        }
        if (typeof val === 'object') {
          if (manifestKey === 'author') {
            val = (0, (_util || _load_util()).stringifyPerson)(val);
          } else if (manifestKey === 'repository') {
            val = (0, (_util || _load_util()).extractRepositoryUrl)(val);
          }
        }
        def = val;
      }

      if (def) {
        question += ` (${def})`;
      }

      let answer;
      let validAnswer = false;

      if (yes) {
        answer = def;
      } else {
        // loop until a valid answer is provided, if validation is on entry
        if (entry.validation) {
          while (!validAnswer) {
            answer = (yield reporter.question(question)) || def;
            // validate answer
            if (entry.validation(String(answer))) {
              validAnswer = true;
            } else {
              reporter.error(reporter.lang('invalidPackageName'));
            }
          }
        } else {
          answer = (yield reporter.question(question)) || def;
        }
      }

      if (answer) {
        objectPath.set(pkg, manifestKey, answer);
      }
    }

    // save answers
    const targetManifests = [];
    for (const registryName of (_index || _load_index()).registryNames) {
      const info = manifests[registryName];
      if (info.exists) {
        targetManifests.push(info);
      }
    }
    if (!targetManifests.length) {
      targetManifests.push(manifests.npm);
    }
    for (const targetManifest of targetManifests) {
      Object.assign(targetManifest.object, pkg);
      reporter.success(`Saved ${path.basename(targetManifest.loc)}`);
    }

    yield config.saveRootManifests(manifests);
  });

  return function run(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

let getGitConfigInfo = exports.getGitConfigInfo = (() => {
  var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (credential) {
    let spawn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (_child || _load_child()).spawn;

    try {
      // try to get author default based on git config
      return yield spawn('git', ['config', credential]);
    } catch (e) {
      return '';
    }
  });

  return function getGitConfigInfo(_x5) {
    return _ref2.apply(this, arguments);
  };
})();

exports.setFlags = setFlags;
exports.hasWrapper = hasWrapper;

var _util;

function _load_util() {
  return _util = require('../../util/normalize-manifest/util.js');
}

var _index;

function _load_index() {
  return _index = require('../../registries/index.js');
}

var _child;

function _load_child() {
  return _child = _interopRequireWildcard(require('../../util/child.js'));
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

var _validate;

function _load_validate() {
  return _validate = _interopRequireWildcard(require('../../util/normalize-manifest/validate.js'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const objectPath = require('object-path');

const path = require('path');

function setFlags(commander) {
  commander.option('-y, --yes', 'use default options');
}

function hasWrapper() {
  return true;
}