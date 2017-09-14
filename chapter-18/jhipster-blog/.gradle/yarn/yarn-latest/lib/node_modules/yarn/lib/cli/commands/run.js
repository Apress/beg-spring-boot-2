'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = undefined;

var _slicedToArray2;

function _load_slicedToArray() {
  return _slicedToArray2 = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray'));
}

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

let run = exports.run = (() => {
  var _ref = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (config, reporter, flags, args) {
    let runCommand = (() => {
      var _ref2 = (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* (args) {
        const action = args.shift();
        const actions = [`pre${action}`, action, `post${action}`];

        // build up list of commands
        const cmds = [];
        for (const action of actions) {
          const cmd = scripts[action];
          if (cmd) {
            cmds.push([action, cmd]);
          }
        }

        if (cmds.length) {
          for (const _ref3 of cmds) {
            var _ref4 = (0, (_slicedToArray2 || _load_slicedToArray()).default)(_ref3, 2);

            const stage = _ref4[0];
            const cmd = _ref4[1];

            // only tack on trailing arguments for default script, ignore for pre and post - #1595
            const defaultScriptCmd = `${cmd} ${sanitizedArgs(args).join(' ')}`;
            const cmdWithArgs = stage === action ? defaultScriptCmd : cmd;
            yield (0, (_executeLifecycleScript || _load_executeLifecycleScript()).execCommand)(stage, config, cmdWithArgs, config.cwd);
          }
        } else {
          let suggestion;

          for (const commandName in scripts) {
            const steps = leven(commandName, action);
            if (steps < 2) {
              suggestion = commandName;
            }
          }

          let msg = `Command ${JSON.stringify(action)} not found.`;
          if (suggestion) {
            msg += ` Did you mean ${JSON.stringify(suggestion)}?`;
          }
          throw new (_errors || _load_errors()).MessageError(msg);
        }
      });

      return function runCommand(_x5) {
        return _ref2.apply(this, arguments);
      };
    })();

    // list possible scripts if none specified


    // build up a list of possible scripts
    const pkg = yield config.readManifest(config.cwd);
    const scripts = (0, (_map || _load_map()).default)();
    const binCommands = [];
    const visitedBinFolders = new Set();
    let pkgCommands = [];
    for (const registry of Object.keys((_index || _load_index()).registries)) {
      const binFolder = path.join(config.cwd, config.registries[registry].folder, '.bin');
      if (!visitedBinFolders.has(binFolder)) {
        if (yield (_fs || _load_fs()).exists(binFolder)) {
          for (const name of yield (_fs || _load_fs()).readdir(binFolder)) {
            binCommands.push(name);
            scripts[name] = `"${path.join(binFolder, name)}"`;
          }
        }
        visitedBinFolders.add(binFolder);
      }
    }
    const pkgScripts = pkg.scripts;
    const cmdHints = {};
    if (pkgScripts) {
      // inherit `scripts` from manifest
      pkgCommands = Object.keys(pkgScripts).sort();

      // add command hints (what the actual yarn command will do)
      for (const cmd of pkgCommands) {
        cmdHints[cmd] = pkgScripts[cmd] || '';
      }

      Object.assign(scripts, pkg.scripts);
    }

    if (args.length === 0) {
      reporter.error(reporter.lang('commandNotSpecified'));
      reporter.info(`${reporter.lang('binCommands') + binCommands.join(', ')}`);
      reporter.info(`${reporter.lang('possibleCommands')}`);
      reporter.list('possibleCommands', pkgCommands, cmdHints);
      yield reporter.question(reporter.lang('commandQuestion')).then(function (answer) {
        return runCommand(answer.split(' '));
      }, function () {
        return reporter.error(reporter.lang('commandNotSpecified'));
      });
      return Promise.resolve();
    } else {
      return yield runCommand(args);
    }
  });

  return function run(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

exports.setFlags = setFlags;
exports.hasWrapper = hasWrapper;

var _executeLifecycleScript;

function _load_executeLifecycleScript() {
  return _executeLifecycleScript = require('../../util/execute-lifecycle-script.js');
}

var _errors;

function _load_errors() {
  return _errors = require('../../errors.js');
}

var _index;

function _load_index() {
  return _index = require('../../resolvers/index.js');
}

var _fs;

function _load_fs() {
  return _fs = _interopRequireWildcard(require('../../util/fs.js'));
}

var _map;

function _load_map() {
  return _map = _interopRequireDefault(require('../../util/map.js'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const leven = require('leven');

const path = require('path');

function sanitizedArgs(args) {
  const newArgs = [];
  for (let arg of args) {
    if (/\s/.test(arg)) {
      arg = `"${arg}"`;
    }
    newArgs.push(arg);
  }
  return newArgs;
}

function setFlags() {}

function hasWrapper() {
  return true;
}