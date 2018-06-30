'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _lodash = require('lodash');

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _client = require('../../client');

var _client2 = _interopRequireDefault(_client);

var _compiler = require('./query/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _columncompiler = require('./schema/columncompiler');

var _columncompiler2 = _interopRequireDefault(_columncompiler);

var _tablecompiler = require('./schema/tablecompiler');

var _tablecompiler2 = _interopRequireDefault(_tablecompiler);

var _compiler3 = require('./schema/compiler');

var _compiler4 = _interopRequireDefault(_compiler3);

var _string = require('../../query/string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// PostgreSQL
// -------
function Client_PG(config) {
  _client2.default.apply(this, arguments);
  if (config.returning) {
    this.defaultReturning = config.returning;
  }

  if (config.searchPath) {
    this.searchPath = config.searchPath;
  }

  if (config.version) {
    this.version = config.version;
  }
}
(0, _inherits2.default)(Client_PG, _client2.default);

(0, _lodash.assign)(Client_PG.prototype, {
  queryCompiler: function queryCompiler() {
    return new (Function.prototype.bind.apply(_compiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  columnCompiler: function columnCompiler() {
    return new (Function.prototype.bind.apply(_columncompiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  schemaCompiler: function schemaCompiler() {
    return new (Function.prototype.bind.apply(_compiler4.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  tableCompiler: function tableCompiler() {
    return new (Function.prototype.bind.apply(_tablecompiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },


  dialect: 'postgresql',

  driverName: 'pg',

  _escapeBinding: (0, _string.makeEscape)({
    escapeArray: function escapeArray(val, esc) {
      return esc(arrayString(val, esc));
    },
    escapeString: function escapeString(str) {
      var hasBackslash = false;
      var escaped = '\'';
      for (var i = 0; i < str.length; i++) {
        var c = str[i];
        if (c === '\'') {
          escaped += c + c;
        } else if (c === '\\') {
          escaped += c + c;
          hasBackslash = true;
        } else {
          escaped += c;
        }
      }
      escaped += '\'';
      if (hasBackslash === true) {
        escaped = 'E' + escaped;
      }
      return escaped;
    },
    escapeObject: function escapeObject(val, prepareValue, timezone) {
      var seen = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      if (val && typeof val.toPostgres === 'function') {
        seen = seen || [];
        if (seen.indexOf(val) !== -1) {
          throw new Error('circular reference detected while preparing "' + val + '" for query');
        }
        seen.push(val);
        return prepareValue(val.toPostgres(prepareValue), seen);
      }
      return (0, _stringify2.default)(val);
    }
  }),

  wrapIdentifierImpl: function wrapIdentifierImpl(value) {
    if (value === '*') return value;

    var arrayAccessor = '';
    var arrayAccessorMatch = value.match(/(.*?)(\[[0-9]+\])/);

    if (arrayAccessorMatch) {
      value = arrayAccessorMatch[1];
      arrayAccessor = arrayAccessorMatch[2];
    }

    return '"' + value.replace(/"/g, '""') + '"' + arrayAccessor;
  },


  // Position the bindings for the query. The escape sequence for question mark
  // is \? (e.g. knex.raw("\\?") since javascript requires '\' to be escaped too...)
  positionBindings: function positionBindings(sql) {
    var questionCount = 0;
    return sql.replace(/(\\*)(\?)/g, function (match, escapes) {
      if (escapes.length % 2) {
        return '?';
      } else {
        questionCount++;
        return '$' + questionCount;
      }
    });
  }
});

function arrayString(arr, esc) {
  var result = '{';
  for (var i = 0; i < arr.length; i++) {
    if (i > 0) result += ',';
    var val = arr[i];
    if (val === null || typeof val === 'undefined') {
      result += 'NULL';
    } else if (Array.isArray(val)) {
      result += arrayString(val, esc);
    } else if (typeof val === 'number') {
      result += val;
    } else {
      result += (0, _stringify2.default)(typeof val === 'string' ? val : esc(val));
    }
  }
  return result + '}';
}

exports.default = Client_PG;
module.exports = exports['default'];