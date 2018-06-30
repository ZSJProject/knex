'use strict';

exports.__esModule = true;

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _lodash = require('lodash');

var _client = require('../../client');

var _client2 = _interopRequireDefault(_client);

var _compiler = require('./query/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _compiler3 = require('./schema/compiler');

var _compiler4 = _interopRequireDefault(_compiler3);

var _columncompiler = require('./schema/columncompiler');

var _columncompiler2 = _interopRequireDefault(_columncompiler);

var _tablecompiler = require('./schema/tablecompiler');

var _tablecompiler2 = _interopRequireDefault(_tablecompiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Client_SQLite3(config) {
  _client2.default.call(this, config);

  if ((0, _lodash.isUndefined)(config.useNullAsDefault)) {
    this.logger.warn('sqlite does not support inserting default values. Set the ' + '`useNullAsDefault` flag to hide this warning. ' + '(see docs http://knexjs.org/#Builder-insert).');
  }
}
// SQLite3
// -------

(0, _inherits2.default)(Client_SQLite3, _client2.default);

(0, _lodash.assign)(Client_SQLite3.prototype, {

  dialect: 'sqlite3',

  driverName: 'sqlite3',

  schemaCompiler: function schemaCompiler() {
    return new (Function.prototype.bind.apply(_compiler4.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  queryCompiler: function queryCompiler() {
    return new (Function.prototype.bind.apply(_compiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  columnCompiler: function columnCompiler() {
    return new (Function.prototype.bind.apply(_columncompiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  tableCompiler: function tableCompiler() {
    return new (Function.prototype.bind.apply(_tablecompiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  wrapIdentifierImpl: function wrapIdentifierImpl(value) {
    return value !== '*' ? '`' + value.replace(/`/g, '``') + '`' : '*';
  }
});

exports.default = Client_SQLite3;
module.exports = exports['default'];