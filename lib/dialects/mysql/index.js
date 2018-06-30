'use strict';

exports.__esModule = true;

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _client = require('../../client');

var _client2 = _interopRequireDefault(_client);

var _compiler = require('./query/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _compiler3 = require('./schema/compiler');

var _compiler4 = _interopRequireDefault(_compiler3);

var _tablecompiler = require('./schema/tablecompiler');

var _tablecompiler2 = _interopRequireDefault(_tablecompiler);

var _columncompiler = require('./schema/columncompiler');

var _columncompiler2 = _interopRequireDefault(_columncompiler);

var _lodash = require('lodash');

var _string = require('../../query/string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.

// MySQL Client
// -------
function Client_MySQL(config) {
  _client2.default.call(this, config);
}
(0, _inherits2.default)(Client_MySQL, _client2.default);

(0, _lodash.assign)(Client_MySQL.prototype, {

  dialect: 'mysql',

  driverName: 'mysql',

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


  _escapeBinding: (0, _string.makeEscape)(),

  wrapIdentifierImpl: function wrapIdentifierImpl(value) {
    return value !== '*' ? '`' + value.replace(/`/g, '``') + '`' : '*';
  }
});

exports.default = Client_MySQL;
module.exports = exports['default'];