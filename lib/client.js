'use strict';

exports.__esModule = true;

var _raw = require('./raw');

var _raw2 = _interopRequireDefault(_raw);

var _ref2 = require('./ref');

var _ref3 = _interopRequireDefault(_ref2);

var _formatter = require('./formatter');

var _formatter2 = _interopRequireDefault(_formatter);

var _builder = require('./query/builder');

var _builder2 = _interopRequireDefault(_builder);

var _compiler = require('./query/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _builder3 = require('./schema/builder');

var _builder4 = _interopRequireDefault(_builder3);

var _compiler3 = require('./schema/compiler');

var _compiler4 = _interopRequireDefault(_compiler3);

var _tablebuilder = require('./schema/tablebuilder');

var _tablebuilder2 = _interopRequireDefault(_tablebuilder);

var _tablecompiler = require('./schema/tablecompiler');

var _tablecompiler2 = _interopRequireDefault(_tablecompiler);

var _columnbuilder = require('./schema/columnbuilder');

var _columnbuilder2 = _interopRequireDefault(_columnbuilder);

var _columncompiler = require('./schema/columncompiler');

var _columncompiler2 = _interopRequireDefault(_columncompiler);

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _events = require('events');

var _string = require('./query/string');

var _lodash = require('lodash');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The base client provides the general structure
// for a dialect specific client object.
function Client() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this.config = config;
  this.logger = new _logger2.default(config);

  //Client is a required field, so throw error if it's not supplied.
  //If 'this.dialect' is set, then this is a 'super()' call, in which case
  //'client' does not have to be set as it's already assigned on the client prototype.
  if (!this.dialect) {
    throw new Error('knex: Required configuration option \'client\' is missing.');
  }

  this.valueForUndefined = this.raw('DEFAULT');

  if (config.useNullAsDefault) {
    this.valueForUndefined = null;
  }
}
(0, _inherits2.default)(Client, _events.EventEmitter);

(0, _lodash.assign)(Client.prototype, {
  formatter: function formatter(builder) {
    return new _formatter2.default(this, builder);
  },
  queryBuilder: function queryBuilder() {
    return new _builder2.default(this);
  },
  queryCompiler: function queryCompiler(builder) {
    return new _compiler2.default(this, builder);
  },
  schemaBuilder: function schemaBuilder() {
    return new _builder4.default(this);
  },
  schemaCompiler: function schemaCompiler(builder) {
    return new _compiler4.default(this, builder);
  },
  tableBuilder: function tableBuilder(type, tableName, fn) {
    return new _tablebuilder2.default(this, type, tableName, fn);
  },
  tableCompiler: function tableCompiler(tableBuilder) {
    return new _tablecompiler2.default(this, tableBuilder);
  },
  columnBuilder: function columnBuilder(tableBuilder, type, args) {
    return new _columnbuilder2.default(this, tableBuilder, type, args);
  },
  columnCompiler: function columnCompiler(tableBuilder, columnBuilder) {
    return new _columncompiler2.default(this, tableBuilder, columnBuilder);
  },
  raw: function raw() {
    var _ref;

    return (_ref = new _raw2.default(this)).set.apply(_ref, arguments);
  },
  ref: function ref() {
    return new (Function.prototype.bind.apply(_ref3.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  _formatQuery: function _formatQuery(sql, bindings, timeZone) {
    var _this = this;

    bindings = bindings == null ? [] : [].concat(bindings);
    var index = 0;
    return sql.replace(/\\?\?/g, function (match) {
      if (match === '\\?') {
        return '?';
      }
      if (index === bindings.length) {
        return match;
      }
      var value = bindings[index++];
      return _this._escapeBinding(value, { timeZone: timeZone });
    });
  },


  _escapeBinding: (0, _string.makeEscape)({
    escapeString: function escapeString(str) {
      return '\'' + str.replace(/'/g, "''") + '\'';
    }
  }),

  prepBindings: function prepBindings(bindings) {
    return bindings;
  },
  positionBindings: function positionBindings(sql) {
    return sql;
  },
  wrapIdentifier: function wrapIdentifier(value, queryContext) {
    return this.customWrapIdentifier(value, this.wrapIdentifierImpl, queryContext);
  },
  customWrapIdentifier: function customWrapIdentifier(value, origImpl, queryContext) {
    if (this.config.wrapIdentifier) {
      return this.config.wrapIdentifier(value, origImpl, queryContext);
    }
    return origImpl(value);
  },
  wrapIdentifierImpl: function wrapIdentifierImpl(value) {
    return value !== '*' ? '"' + value.replace(/"/g, '""') + '"' : '*';
  },
  toString: function toString() {
    return '[object KnexClient]';
  }
});

exports.default = Client;
module.exports = exports['default'];