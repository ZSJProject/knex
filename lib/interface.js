'use strict';

exports.__esModule = true;

exports.default = function (Target) {

  Target.prototype.toQuery = function (tz) {
    var _this = this;

    var data = this.toSQL(this._method, tz);
    if (!(0, _lodash.isArray)(data)) data = [data];
    return (0, _lodash.map)(data, function (statement) {
      return _this.client._formatQuery(statement.sql, statement.bindings, tz);
    }).join(';\n');
  };

  // Add additional "options" to the builder. Typically used for client specific
  // items, like the `mysql` and `sqlite3` drivers.
  Target.prototype.options = function (opts) {
    this._options = this._options || [];
    this._options.push((0, _lodash.clone)(opts) || {});
    return this;
  };

  // Set a debug flag for the current schema query stack.
  Target.prototype.debug = function (enabled) {
    this._debug = arguments.length ? enabled : true;
    return this;
  };
};

var _lodash = require('lodash');

module.exports = exports['default'];