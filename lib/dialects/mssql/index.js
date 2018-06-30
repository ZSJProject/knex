'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash');

var _inherits4 = require('inherits');

var _inherits5 = _interopRequireDefault(_inherits4);

var _client = require('../../client');

var _client2 = _interopRequireDefault(_client);

var _formatter = require('../../formatter');

var _formatter2 = _interopRequireDefault(_formatter);

var _compiler = require('./query/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _compiler3 = require('./schema/compiler');

var _compiler4 = _interopRequireDefault(_compiler3);

var _tablecompiler = require('./schema/tablecompiler');

var _tablecompiler2 = _interopRequireDefault(_tablecompiler);

var _columncompiler = require('./schema/columncompiler');

var _columncompiler2 = _interopRequireDefault(_columncompiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Always initialize with the "QueryBuilder" and "QueryCompiler" objects, which
// extend the base 'lib/query/builder' and 'lib/query/compiler', respectively.

// MSSQL Client
// -------
function Client_MSSQL() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _client2.default.call(this, config);
}
(0, _inherits5.default)(Client_MSSQL, _client2.default);

(0, _lodash.assign)(Client_MSSQL.prototype, {

  dialect: 'mssql',

  driverName: 'mssql',

  formatter: function formatter() {
    return new (Function.prototype.bind.apply(MSSQL_Formatter, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  queryCompiler: function queryCompiler() {
    return new (Function.prototype.bind.apply(_compiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  schemaCompiler: function schemaCompiler() {
    return new (Function.prototype.bind.apply(_compiler4.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  tableCompiler: function tableCompiler() {
    return new (Function.prototype.bind.apply(_tablecompiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  columnCompiler: function columnCompiler() {
    return new (Function.prototype.bind.apply(_columncompiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  wrapIdentifierImpl: function wrapIdentifierImpl(value) {
    return value !== '*' ? '[' + value.replace(/\[/g, '[') + ']' : '*';
  },


  // Position the bindings for the query.
  positionBindings: function positionBindings(sql) {
    var questionCount = -1;
    return sql.replace(/\?/g, function () {
      questionCount += 1;
      return '@p' + questionCount;
    });
  }
});

var MSSQL_Formatter = function (_Formatter) {
  (0, _inherits3.default)(MSSQL_Formatter, _Formatter);

  function MSSQL_Formatter() {
    (0, _classCallCheck3.default)(this, MSSQL_Formatter);
    return (0, _possibleConstructorReturn3.default)(this, _Formatter.apply(this, arguments));
  }

  // Accepts a string or array of columns to wrap as appropriate.
  MSSQL_Formatter.prototype.columnizeWithPrefix = function columnizeWithPrefix(prefix, target) {
    var columns = typeof target === 'string' ? [target] : target;
    var str = '',
        i = -1;
    while (++i < columns.length) {
      if (i > 0) str += ', ';
      str += prefix + this.wrap(columns[i]);
    }
    return str;
  };

  return MSSQL_Formatter;
}(_formatter2.default);

exports.default = Client_MSSQL;
module.exports = exports['default'];