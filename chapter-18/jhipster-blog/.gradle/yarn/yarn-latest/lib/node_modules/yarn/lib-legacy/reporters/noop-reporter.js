'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator2;

function _load_asyncToGenerator() {
  return _asyncToGenerator2 = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator'));
}

var _promise;

function _load_promise() {
  return _promise = _interopRequireDefault(require('babel-runtime/core-js/promise'));
}

var _format;

function _load_format() {
  return _format = require('./format.js');
}

var _index;

function _load_index() {
  return _index = _interopRequireWildcard(require('./lang/index.js'));
}

var _isCi;

function _load_isCi() {
  return _isCi = _interopRequireDefault(require('is-ci'));
}

var _baseReporter;

function _load_baseReporter() {
  return _baseReporter = _interopRequireDefault(require('./base-reporter.js'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NoopReporter extends (_baseReporter || _load_baseReporter()).default {
  lang(key) {
    return 'do nothing';
  }
  verbose(msg) {}
  verboseInspect(val) {}
  initPeakMemoryCounter() {}
  checkPeakMemory() {}
  close() {}
  getTotalTime() {
    return 0;
  }
  list(key, items, hints) {}
  tree(key, obj) {}
  step(current, total, message, emoji) {}
  error(message) {}
  info(message) {}
  warn(message) {}
  success(message) {}
  log(message) {}
  command(command) {}
  inspect(value) {}
  header(command, pkg) {}
  footer(showPeakMemory) {}
  table(head, body) {}

  activity() {
    return {
      tick: function tick(name) {},
      end: function end() {}
    };
  }

  activitySet(total, workers) {
    return {
      spinners: Array(workers).fill({
        clear: function clear() {},
        setPrefix: function setPrefix() {},
        tick: function tick() {},
        end: function end() {}
      }),
      end: function end() {}
    };
  }

  question(question) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return (_promise || _load_promise()).default.reject(new Error('Not implemented'));
  }

  questionAffirm(question) {
    var _this = this;

    return (0, (_asyncToGenerator2 || _load_asyncToGenerator()).default)(function* () {
      yield _this.question(question);
      return false;
    })();
  }

  select(header, question, options) {
    return (_promise || _load_promise()).default.reject(new Error('Not implemented'));
  }

  progress(total) {
    return function () {};
  }

  disableProgress() {
    this.noProgress = true;
  }

  prompt(message, choices) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return (_promise || _load_promise()).default.reject(new Error('Not implemented'));
  }
}
exports.default = NoopReporter;
/* eslint no-unused-vars: 0 */