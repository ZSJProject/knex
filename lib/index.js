'use strict';

exports.__esModule = true;

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

exports.default = Knex;

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _raw = require('./raw');

var _raw2 = _interopRequireDefault(_raw);

var _makeKnex = require('./util/make-knex');

var _makeKnex2 = _interopRequireDefault(_makeKnex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The client names we'll allow in the `{name: lib}` pairing.
var aliases = {
  'mariadb': 'maria',
  'mariasql': 'maria',
  'pg': 'postgres',
  'postgresql': 'postgres',
  'sqlite': 'sqlite3'
};

function Knex(config) {
  var Dialect = void 0;
  var clientName = config.client || config.dialect;

  if (clientName) {
    Dialect = require('./dialects/' + (aliases[clientName] || clientName) + '/index.js');
  }

  if (Dialect) return (0, _makeKnex2.default)(new Dialect(config));else return (0, _makeKnex2.default)(new _client2.default());
}

/* eslint no-console:0 */

(0, _defineProperties2.default)(Knex, {
  VERSION: {
    get: function get() {
      console.warn('Knex.VERSION is deprecated, you can get the module version' + "by running require('knex/package').version");
      return '0.12.6';
    }
  }
});

Knex.Client = _client2.default;

// Run a "raw" query, though we can't do anything with it other than put
// it in a query statement.
Knex.raw = function (sql, bindings) {
  console.warn('global Knex.raw is deprecated, use knex.raw (chain off an initialized knex object)');
  return new _raw2.default().set(sql, bindings);
};
module.exports = exports['default'];