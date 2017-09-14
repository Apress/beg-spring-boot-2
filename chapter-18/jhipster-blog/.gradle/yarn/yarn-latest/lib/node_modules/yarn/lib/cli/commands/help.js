'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasWrapper = hasWrapper;
exports.setFlags = setFlags;
exports.run = run;

var _index;

function _load_index() {
  return _index = _interopRequireDefault(require('./index.js'));
}

var _constants;

function _load_constants() {
  return _constants = _interopRequireWildcard(require('../../constants.js'));
}

var _misc;

function _load_misc() {
  return _misc = require('../../util/misc.js');
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const chalk = require('chalk');

function hasWrapper() {
  return false;
}

function setFlags() {}

function run(config, reporter, commander, args) {
  if (args.length) {
    const commandName = args.shift();
    if (Object.prototype.hasOwnProperty.call((_index || _load_index()).default, commandName)) {
      const command = (_index || _load_index()).default[commandName];
      if (command) {
        command.setFlags(commander);
        const examples = command && command.examples || [];
        if (examples.length) {
          commander.on('--help', () => {
            console.log('  Examples:\n');
            for (const example of examples) {
              console.log(`    $ yarn ${example}`);
            }
            console.log();
          });
        }
        commander.on('--help', () => console.log('  ' + command.getDocsInfo + '\n'));
        commander.help();
        return Promise.resolve();
      }
    }
  }

  commander.on('--help', () => {
    const getDocsLink = name => `${(_constants || _load_constants()).YARN_DOCS}${name || ''}`;
    console.log('  Commands:\n');
    for (const name of Object.keys((_index || _load_index()).default).sort((_misc || _load_misc()).sortAlpha)) {
      if ((_index || _load_index()).default[name].useless) {
        continue;
      }

      console.log(`    - ${(0, (_misc || _load_misc()).hyphenate)(name)}`);
    }
    console.log('\n  Run `' + chalk.bold('yarn help COMMAND') + '` for more information on specific commands.');
    console.log('  Visit ' + chalk.bold(getDocsLink()) + ' to learn more about Yarn.\n');
  });

  commander.help();
  return Promise.resolve();
}