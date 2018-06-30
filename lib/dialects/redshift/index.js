'use strict';

exports.__esModule = true;

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _postgres = require('../postgres');

var _postgres2 = _interopRequireDefault(_postgres);

var _lodash = require('lodash');

var _compiler = require('./query/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _columnbuilder = require('./schema/columnbuilder');

var _columnbuilder2 = _interopRequireDefault(_columnbuilder);

var _columncompiler = require('./schema/columncompiler');

var _columncompiler2 = _interopRequireDefault(_columncompiler);

var _tablecompiler = require('./schema/tablecompiler');

var _tablecompiler2 = _interopRequireDefault(_tablecompiler);

var _compiler3 = require('./schema/compiler');

var _compiler4 = _interopRequireDefault(_compiler3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Redshift
// -------
function Client_Redshift(config) {
  _postgres2.default.apply(this, arguments);
}
(0, _inherits2.default)(Client_Redshift, _postgres2.default);

(0, _lodash.assign)(Client_Redshift.prototype, {
  queryCompiler: function queryCompiler() {
    return new (Function.prototype.bind.apply(_compiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  columnBuilder: function columnBuilder() {
    return new (Function.prototype.bind.apply(_columnbuilder2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  columnCompiler: function columnCompiler() {
    return new (Function.prototype.bind.apply(_columncompiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  tableCompiler: function tableCompiler() {
    return new (Function.prototype.bind.apply(_tablecompiler2.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },
  schemaCompiler: function schemaCompiler() {
    return new (Function.prototype.bind.apply(_compiler4.default, [null].concat([this], Array.prototype.slice.call(arguments))))();
  },


  dialect: 'redshift',

  driverName: 'pg-redshift'
});

exports.default = Client_Redshift;
module.exports = exports['default'];