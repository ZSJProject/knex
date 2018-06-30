'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Oracledb Client
// -------
var _ = require('lodash');
var inherits = require('inherits');
var QueryCompiler = require('./query/compiler');
var ColumnCompiler = require('./schema/columncompiler');
var BlobHelper = require('./utils').BlobHelper;
var ReturningHelper = require('./utils').ReturningHelper;
var Client_Oracle = require('../oracle');
var Oracle_Formatter = require('../oracle/formatter');

function Client_Oracledb() {
  Client_Oracle.apply(this, arguments);
}

inherits(Client_Oracledb, Client_Oracle);

Client_Oracledb.prototype.driverName = 'oracledb';

Client_Oracledb.prototype.queryCompiler = function () {
  return new (Function.prototype.bind.apply(QueryCompiler, [null].concat([this], Array.prototype.slice.call(arguments))))();
};

Client_Oracledb.prototype.columnCompiler = function () {
  return new (Function.prototype.bind.apply(ColumnCompiler, [null].concat([this], Array.prototype.slice.call(arguments))))();
};

Client_Oracledb.prototype.formatter = function () {
  return new (Function.prototype.bind.apply(Oracledb_Formatter, [null].concat([this], Array.prototype.slice.call(arguments))))();
};

Client_Oracledb.prototype.prepBindings = function (bindings) {
  var _this = this;

  return _.map(bindings, function (value) {
    if (value instanceof BlobHelper && _this.driver) {
      return { type: _this.driver.BLOB, dir: _this.driver.BIND_OUT };
      // Returning helper always use ROWID as string
    } else if (value instanceof ReturningHelper && _this.driver) {
      return { type: _this.driver.STRING, dir: _this.driver.BIND_OUT };
    } else if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value;
  });
};

var Oracledb_Formatter = function (_Oracle_Formatter) {
  (0, _inherits3.default)(Oracledb_Formatter, _Oracle_Formatter);

  function Oracledb_Formatter() {
    (0, _classCallCheck3.default)(this, Oracledb_Formatter);
    return (0, _possibleConstructorReturn3.default)(this, _Oracle_Formatter.apply(this, arguments));
  }

  // Checks whether a value is a function... if it is, we compile it
  // otherwise we check whether it's a raw
  Oracledb_Formatter.prototype.parameter = function parameter(value) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value), true);
    } else if (value instanceof BlobHelper) {
      return 'EMPTY_BLOB()';
    }
    return this.unwrapRaw(value, true) || '?';
  };

  return Oracledb_Formatter;
}(Oracle_Formatter);

module.exports = Client_Oracledb;