'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRequestToRegistry;

var _url;

function _load_url() {
  return _url = _interopRequireDefault(require('url'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isRequestToRegistry(requestUrl, registry) {
  const requestParsed = (_url || _load_url()).default.parse(requestUrl);
  const registryParsed = (_url || _load_url()).default.parse(registry);
  const requestPort = getPortOrDefaultPort(requestParsed.port, requestParsed.protocol);
  const registryPort = getPortOrDefaultPort(registryParsed.port, registryParsed.protocol);
  const requestPath = requestParsed.path || '';
  const registryPath = registryParsed.path || '';

  return requestParsed.hostname === registryParsed.hostname && requestPort === registryPort && requestPath.startsWith(registryPath);
}

function getPortOrDefaultPort(port, protocol) {
  if (protocol === 'https:' && port === '443') {
    return null;
  }
  if (protocol === 'http:' && port === '80') {
    return null;
  }
  return port;
}