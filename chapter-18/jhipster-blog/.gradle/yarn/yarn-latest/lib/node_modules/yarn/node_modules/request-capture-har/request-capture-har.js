var fs = require('fs');
var pkg = require('./package.json');

function buildHarHeaders (headers) {
  return headers ? Object.keys(headers).map(function (key) {
    return {
      name: key,
      // header values are required to be strings
      value: headers[key].toString()
    };
  }) : [];
}

function appendPostData (entry, request) {
  if (!request.body) return;

  entry.request.postData = {
    mimeType: 'application/octet-stream',
    text: request.body
  };
}

function toMs (num) {
  return Math.round(num * 1000) / 1000;
}

function HarWrapper (requestModule) {
  this.requestModule = requestModule;
  this.clear();
}

HarWrapper.prototype.request = function (options) {
  // include detailed timing data in response object
  Object.assign(options, { time: true });
  var self = this;
  // make call to true request module
  return this.requestModule(options, function (err, incomingMessage, response) {
    // create new har entry with reponse timings
    if (!err) {
      self.entries.push(self.buildHarEntry(incomingMessage));
    }

    // fire any callback provided in options, as request has ignored it
    //     https://github.com/request/request/blob/v2.75.0/index.js#L40
    if (typeof options.callback === 'function') {
      options.callback.apply(null, arguments);
    }
  });
};

HarWrapper.prototype.clear = function () {
  this.entries = [];
  this.earliestTime = new Date(2099, 1, 1);
};

HarWrapper.prototype.saveHar = function (fileName) {
  var httpArchive = {
    log: {
      version: '1.2',
      creator: {name: 'request-capture-har', version: pkg.version},
      pages: [{
        startedDateTime: new Date(this.earliestTime).toISOString(),
        id: 'request-capture-har',
        title: 'request-capture-har',
        pageTimings: { }
      }],
      entries: this.entries
    }
  };
  fs.writeFileSync(fileName, JSON.stringify(httpArchive, null, 2));
};

HarWrapper.prototype.buildTimings = function (entry, response) {
  var startTs = response.request.startTime;
  var endTs = startTs + response.elapsedTime;
  var totalTime = endTs - startTs;

  if (new Date(startTs) < this.earliestTime) {
    this.earliestTime = new Date(startTs);
  }
  entry.startedDateTime = new Date(startTs).toISOString();
  entry.time = totalTime;

  // new timing data added in request 2.81.0
  if (response.timingPhases) {
    entry.timings = {
      'blocked': toMs(response.timingPhases.wait),
      'dns': toMs(response.timingPhases.dns),
      'connect': toMs(response.timingPhases.tcp),
      'send': 0,
      'wait': toMs(response.timingPhases.firstByte),
      'receive': toMs(response.timingPhases.download)
    };
    return;
  }

  var responseStartTs = response.request.response.responseStartTime;

  var waitingTime = responseStartTs - startTs;
  var receiveTime = endTs - responseStartTs;
  entry.timings = {
    send: 0,
    wait: waitingTime,
    receive: receiveTime
  };
};

HarWrapper.prototype.buildHarEntry = function (response) {
  var entry = {
    request: {
      method: response.request.method,
      url: response.request.uri.href,
      httpVersion: 'HTTP/' + response.httpVersion,
      cookies: [],
      headers: buildHarHeaders(response.request.headers),
      queryString: [],
      headersSize: -1,
      bodySize: -1
    },
    response: {
      status: response.statusCode,
      statusText: response.statusMessage,
      httpVersion: 'HTTP/' + response.httpVersion,
      cookies: [],
      headers: buildHarHeaders(response.headers),
      _transferSize: response.body.length,
      content: {
        size: response.body.length,
        mimeType: response.headers['content-type']
      },
      redirectURL: '',
      headersSize: -1,
      bodySize: -1
    },
    cache: {}
  };
  this.buildTimings(entry, response);
  appendPostData(entry, response.request);
  return entry;
};

module.exports = HarWrapper;
