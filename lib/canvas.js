'use strict';

// var Promise = require('bluebird');
// var request = Promise.promisify(require('request'));
var request = require('request');
var resolve = require('url').resolve;

function Canvas(host, options) {
    options = options || {};
    this.name = 'canvas' || options.name;
    this.accessToken = options.accessToken || options.token || '';
    this.apiVersion = options.apiVersion || options.version || 'v1';
    this.host = host;
}

function isHttpClientError(response) {
    return (response.statusCode >= 400 && response.statusCode < 500);
}

function isHttpError(response) {
    return (isHttpClientError(response) || isHttpServerError(response));
}

function isHttpServerError(response) {
    return (response.statusCode >= 500 && response.statusCode < 600);
}

Canvas.prototype._buildApiUrl = function (endpoint) {
    if (endpoint.substring(0, 1) != '/') {
        endpoint = '/' + endpoint;
    }
    return resolve(this.host,  '/api/' + this.apiVersion + endpoint);
};

Canvas.prototype._http = function (options) {
    options.headers = {
        Authorization: 'Bearer ' + this.accessToken
    };
    options.json = true;
    return request(options,  function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body) // Print the google web page.
        }
    });
};

Canvas.prototype.delete = function (endpoint, querystring) {
    var options = {
        method: 'DELETE',
        url: this._buildApiUrl(endpoint),
        qs: querystring
    };
    return this._http(options);
};

Canvas.prototype.get = function (endpoint, querystring) {
    var options = {
        method: 'GET',
        url: this._buildApiUrl(endpoint),
        qs: querystring
    };
    return this._http(options);
};

Canvas.prototype.post = function (endpoint, querystring, form) {
    var options = {
        method: 'POST',
        url: this._buildApiUrl(endpoint),
        qs: querystring,
        form: form
    };
    return this._http(options);
};

Canvas.prototype.put = function (endpoint, querystring, form) {
    var options = {
        method: 'PUT',
        url: this._buildApiUrl(endpoint),
        qs: querystring,
        form: form
    };
    return this._http(options);
};

module.exports = Canvas;
