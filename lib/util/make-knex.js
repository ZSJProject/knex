'use strict';

exports.__esModule = true;

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

exports.default = makeKnex;

var _methods = require('../query/methods');

var _methods2 = _interopRequireDefault(_methods);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeKnex(client) {

  // The object we're potentially using to kick off an initial chain.
  function knex(tableName, options) {
    var qb = knex.queryBuilder();
    if (!tableName) client.logger.warn('calling knex without a tableName is deprecated. Use knex.queryBuilder() instead.');
    return tableName ? qb.table(tableName, options) : qb;
  }

  (0, _lodash.assign)(knex, {
    // A new query builder instance.
    queryBuilder: function queryBuilder() {
      return client.queryBuilder();
    },
    raw: function raw() {
      return client.raw.apply(client, arguments);
    },
    ref: function ref(_ref) {
      return client.ref(_ref);
    }
  });

  // Allow chaining methods from the root object, before
  // any other information is specified.
  _methods2.default.forEach(function (method) {
    knex[method] = function () {
      var builder = knex.queryBuilder();
      return builder[method].apply(builder, arguments);
    };
  });

  knex.client = client;

  var VERSION = '0.12.6';

  (0, _defineProperties2.default)(knex, {

    __knex__: {
      get: function get() {
        knex.client.logger.warn('knex.__knex__ is deprecated, you can get the module version' + "by running require('knex/package').version");
        return VERSION;
      }
    },

    VERSION: {
      get: function get() {
        knex.client.logger.warn('knex.VERSION is deprecated, you can get the module version' + "by running require('knex/package').version");
        return VERSION;
      }
    },

    schema: {
      get: function get() {
        return client.schemaBuilder();
      }
    }

  });

  client.makeKnex = makeKnex;

  return knex;
}
module.exports = exports['default'];