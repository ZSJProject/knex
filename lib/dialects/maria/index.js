'use strict';

exports.__esModule = true;

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _mysql = require('../mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Client_MariaSQL(config) {
  _mysql2.default.call(this, config);
}
// MariaSQL Client
// -------

(0, _inherits2.default)(Client_MariaSQL, _mysql2.default);

(0, _lodash.assign)(Client_MariaSQL.prototype, {

  dialect: 'mariadb',

  driverName: 'mariasql'

});

exports.default = Client_MariaSQL;
module.exports = exports['default'];