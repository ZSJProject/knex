
// Oracledb Client
// -------
const _ = require('lodash');
const inherits = require('inherits');
const QueryCompiler = require('./query/compiler');
const ColumnCompiler = require('./schema/columncompiler');
const BlobHelper = require('./utils').BlobHelper;
const ReturningHelper = require('./utils').ReturningHelper;
const Client_Oracle = require('../oracle');
const Oracle_Formatter = require('../oracle/formatter');

function Client_Oracledb() {
  Client_Oracle.apply(this, arguments);
}

inherits(Client_Oracledb, Client_Oracle);

Client_Oracledb.prototype.driverName = 'oracledb';

Client_Oracledb.prototype.queryCompiler = function() {
  return new QueryCompiler(this, ...arguments)
}

Client_Oracledb.prototype.columnCompiler = function() {
  return new ColumnCompiler(this, ...arguments)
}

Client_Oracledb.prototype.formatter = function() {
  return new Oracledb_Formatter(this, ...arguments)
}

Client_Oracledb.prototype.prepBindings = function(bindings) {
  return _.map(bindings, (value) => {
    if (value instanceof BlobHelper && this.driver) {
      return {type: this.driver.BLOB, dir: this.driver.BIND_OUT};
      // Returning helper always use ROWID as string
    } else if (value instanceof ReturningHelper && this.driver) {
      return {type: this.driver.STRING, dir: this.driver.BIND_OUT};
    } else if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value;
  });
};

class Oracledb_Formatter extends Oracle_Formatter {

  // Checks whether a value is a function... if it is, we compile it
  // otherwise we check whether it's a raw
  parameter(value) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value), true);
    } else if (value instanceof BlobHelper) {
      return 'EMPTY_BLOB()';
    }
    return this.unwrapRaw(value, true) || '?';
  }

}

module.exports = Client_Oracledb;
