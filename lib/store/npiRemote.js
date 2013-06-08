var http = require('http'),
    Q = require('q'),
    weeklyRegex = /NPPES_Data_Dissemination_(\d+_\d+)_Weekly.zip/g,
    fullRegex = /NPPES_Data_Dissemination_([a-zA-Z]+_\d+).zip/,
    npiIndexOptions = {
      host: 'nppes.viva-it.com',
      port: 80,
      path: '/NPI_Files.html'
    };

module.exports = function () {};

function fetch () {
  if (this.fetched === undefined) {
    var deferred = Q.defer();
    http.get(npiIndexOptions, function (res) {
      var full = "";
      res.on('data', function (data) {
        full += data;
      });
      res.on('end', function (data) {
        deferred.resolve(full);
      });
    }).on('error', function (e) {
      deferred.reject(new Error(e));
    });
    return deferred.promise;
  } else {
    return Q.fcall(function () {
      return this.fetched;
    });
  }
}

module.exports.prototype = {
  currentFullID: function () {
    return fetch.bind(this)()
    .then(function (data) {
      var match = fullRegex.exec(data.toString());
      if (match && match[1]) {
        return match[1];
      } else {
        throw new Error("Full download URI not found");
      }
    });
  },
  currentWeeklyIDs: function () {
    return fetch.bind(this)()
    .then(function (data) {
      var matches = [],
          match;
      while (match = weeklyRegex.exec(data)) {
        matches.push(match[1]);
      }

      return matches;
    });
  },
  fetchFull: function () {

  },
  fetchWeekly: function (id) {

  }
};