'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPathKey = getPathKey;
const path = require('path');
const userHome = require('./util/user-home-dir').default;

const DEPENDENCY_TYPES = exports.DEPENDENCY_TYPES = ['devDependencies', 'dependencies', 'optionalDependencies', 'peerDependencies'];

const YARN_REGISTRY = exports.YARN_REGISTRY = 'https://registry.yarnpkg.com';

const YARN_DOCS = exports.YARN_DOCS = 'https://yarnpkg.com/en/docs/cli/';
const YARN_INSTALLER_SH = exports.YARN_INSTALLER_SH = 'https://yarnpkg.com/install.sh';
const YARN_INSTALLER_MSI = exports.YARN_INSTALLER_MSI = 'https://yarnpkg.com/latest.msi';

const SELF_UPDATE_VERSION_URL = exports.SELF_UPDATE_VERSION_URL = 'https://yarnpkg.com/latest-version';
const SELF_UPDATE_TARBALL_URL = exports.SELF_UPDATE_TARBALL_URL = 'https://yarnpkg.com/latest.tar.gz';
const SELF_UPDATE_DOWNLOAD_FOLDER = exports.SELF_UPDATE_DOWNLOAD_FOLDER = 'updates';

// cache version, bump whenever we make backwards incompatible changes
const CACHE_VERSION = exports.CACHE_VERSION = 1;

// lockfile version, bump whenever we make backwards incompatible changes
const LOCKFILE_VERSION = exports.LOCKFILE_VERSION = 1;

// max amount of network requests to perform concurrently
const NETWORK_CONCURRENCY = exports.NETWORK_CONCURRENCY = 8;

// HTTP timeout used when downloading packages
const NETWORK_TIMEOUT = exports.NETWORK_TIMEOUT = 30 * 1000; // in milliseconds

// max amount of child processes to execute concurrently
const CHILD_CONCURRENCY = exports.CHILD_CONCURRENCY = 5;

const REQUIRED_PACKAGE_KEYS = exports.REQUIRED_PACKAGE_KEYS = ['name', 'version', '_uid'];

function getDirectory(category) {
  // use %LOCALAPPDATA%/Yarn on Windows
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    return path.join(process.env.LOCALAPPDATA, 'Yarn', category);
  }

  // otherwise use ~/.{category}/yarn
  return path.join(userHome, `.${category}`, 'yarn');
}

function getCacheDirectory() {
  if (process.platform === 'darwin') {
    return path.join(userHome, 'Library', 'Caches', 'Yarn');
  }

  return getDirectory('cache');
}

const MODULE_CACHE_DIRECTORY = exports.MODULE_CACHE_DIRECTORY = getCacheDirectory();
const CONFIG_DIRECTORY = exports.CONFIG_DIRECTORY = getDirectory('config');
const LINK_REGISTRY_DIRECTORY = exports.LINK_REGISTRY_DIRECTORY = path.join(CONFIG_DIRECTORY, 'link');
const GLOBAL_MODULE_DIRECTORY = exports.GLOBAL_MODULE_DIRECTORY = path.join(CONFIG_DIRECTORY, 'global');

const META_FOLDER = exports.META_FOLDER = '.yarn-meta';
const INTEGRITY_FILENAME = exports.INTEGRITY_FILENAME = '.yarn-integrity';
const LOCKFILE_FILENAME = exports.LOCKFILE_FILENAME = 'yarn.lock';
const METADATA_FILENAME = exports.METADATA_FILENAME = '.yarn-metadata.json';
const TARBALL_FILENAME = exports.TARBALL_FILENAME = '.yarn-tarball.tgz';
const CLEAN_FILENAME = exports.CLEAN_FILENAME = '.yarnclean';

const DEFAULT_INDENT = exports.DEFAULT_INDENT = '  ';
const SINGLE_INSTANCE_PORT = exports.SINGLE_INSTANCE_PORT = 31997;
const SINGLE_INSTANCE_FILENAME = exports.SINGLE_INSTANCE_FILENAME = '.yarn-single-instance';

const ENV_PATH_KEY = exports.ENV_PATH_KEY = getPathKey(process.platform, process.env);

function getPathKey(platform, env) {
  let pathKey = 'PATH';

  // windows calls its path "Path" usually, but this is not guaranteed.
  if (platform === 'win32') {
    pathKey = 'Path';

    for (const key in env) {
      if (key.toLowerCase() === 'path') {
        pathKey = key;
      }
    }
  }

  return pathKey;
}