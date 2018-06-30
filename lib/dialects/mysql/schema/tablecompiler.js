'use strict';

exports.__esModule = true;

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _tablecompiler = require('../../../schema/tablecompiler');

var _tablecompiler2 = _interopRequireDefault(_tablecompiler);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Table Compiler
// ------

function TableCompiler_MySQL() {
  _tablecompiler2.default.apply(this, arguments);
} /* eslint max-len:0 no-console:0*/

// MySQL Table Builder & Compiler
// -------

(0, _inherits2.default)(TableCompiler_MySQL, _tablecompiler2.default);

(0, _lodash.assign)(TableCompiler_MySQL.prototype, {
  createQuery: function createQuery(columns, ifNot) {
    var createStatement = ifNot ? 'create table if not exists ' : 'create table ';
    var client = this.client;

    var conn = {};
    var sql = createStatement + this.tableName() + ' (' + columns.sql.join(', ') + ')';

    // Check if the connection settings are set.
    if (client.connectionSettings) {
      conn = client.connectionSettings;
    }

    var charset = this.single.charset || conn.charset || '';
    var collation = this.single.collate || conn.collate || '';
    var engine = this.single.engine || '';

    // var conn = builder.client.connectionSettings;
    if (charset) sql += ' default character set ' + charset;
    if (collation) sql += ' collate ' + collation;
    if (engine) sql += ' engine = ' + engine;

    if (this.single.comment) {
      var comment = this.single.comment || '';
      if (comment.length > 60) this.client.logger.warn('The max length for a table comment is 60 characters');
      sql += ' comment = \'' + comment + '\'';
    }

    this.pushQuery(sql);
  },


  addColumnsPrefix: 'add ',

  alterColumnsPrefix: 'modify ',

  dropColumnPrefix: 'drop ',

  // Compiles the comment on the table.
  comment: function comment(_comment) {
    this.pushQuery('alter table ' + this.tableName() + ' comment = \'' + _comment + '\'');
  },
  changeType: function changeType() {
    // alter table + table + ' modify ' + wrapped + '// type';
  },
  index: function index(columns, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('index', this.tableNameRaw, columns);
    this.pushQuery('alter table ' + this.tableName() + ' add index ' + indexName + '(' + this.formatter.columnize(columns) + ')');
  },
  primary: function primary(columns, constraintName) {
    constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(this.tableNameRaw + '_pkey');
    this.pushQuery('alter table ' + this.tableName() + ' add primary key ' + constraintName + '(' + this.formatter.columnize(columns) + ')');
  },
  unique: function unique(columns, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('unique', this.tableNameRaw, columns);
    this.pushQuery('alter table ' + this.tableName() + ' add unique ' + indexName + '(' + this.formatter.columnize(columns) + ')');
  },


  // Compile a drop index command.
  dropIndex: function dropIndex(columns, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('index', this.tableNameRaw, columns);
    this.pushQuery('alter table ' + this.tableName() + ' drop index ' + indexName);
  },


  // Compile a drop foreign key command.
  dropForeign: function dropForeign(columns, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('foreign', this.tableNameRaw, columns);
    this.pushQuery('alter table ' + this.tableName() + ' drop foreign key ' + indexName);
  },


  // Compile a drop primary key command.
  dropPrimary: function dropPrimary() {
    this.pushQuery('alter table ' + this.tableName() + ' drop primary key');
  },


  // Compile a drop unique key command.
  dropUnique: function dropUnique(column, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('unique', this.tableNameRaw, column);
    this.pushQuery('alter table ' + this.tableName() + ' drop index ' + indexName);
  }
});

exports.default = TableCompiler_MySQL;
module.exports = exports['default'];