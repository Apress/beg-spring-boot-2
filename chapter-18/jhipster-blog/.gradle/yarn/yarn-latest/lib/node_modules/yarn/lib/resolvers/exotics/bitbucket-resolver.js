'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hostedGitResolver;

function _load_hostedGitResolver() {
  return _hostedGitResolver = _interopRequireDefault(require('./hosted-git-resolver.js'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BitbucketResolver extends (_hostedGitResolver || _load_hostedGitResolver()).default {

  static getTarballUrl(parts, hash) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}/get/${hash}.tar.gz`;
  }

  static getGitHTTPBaseUrl(parts) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}`;
  }

  static getGitHTTPUrl(parts) {
    return `${BitbucketResolver.getGitHTTPBaseUrl(parts)}.git`;
  }

  static getGitSSHUrl(parts) {
    return `git+ssh://git@${this.hostname}/${parts.user}/${parts.repo}.git` + `${parts.hash ? '#' + decodeURIComponent(parts.hash) : ''}`;
  }

  static getHTTPFileUrl(parts, filename, commit) {
    return `https://${this.hostname}/${parts.user}/${parts.repo}/raw/${commit}/${filename}`;
  }
}
exports.default = BitbucketResolver;
BitbucketResolver.hostname = 'bitbucket.org';
BitbucketResolver.protocol = 'bitbucket';