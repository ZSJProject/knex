/* eslint max-len:0 no-console:0*/

// MySQL Table Builder & Compiler
// -------
import inherits from 'inherits';
import TableCompiler from '../../../schema/tablecompiler';

import { assign } from 'lodash'

// Table Compiler
// ------

function TableCompiler_MySQL() {
  TableCompiler.apply(this, arguments);
}
inherits(TableCompiler_MySQL, TableCompiler);

assign(TableCompiler_MySQL.prototype, {

  createQuery(columns, ifNot) {
    const createStatement = ifNot ? 'create table if not exists ' : 'create table ';
    const { client } = this;
    let conn = {};
    let sql = createStatement + this.tableName() + ' (' + columns.sql.join(', ') + ')';

    // Check if the connection settings are set.
    if (client.connectionSettings) {
      conn = client.connectionSettings;
    }

    const charset = this.single.charset || conn.charset || '';
    const collation = this.single.collate || conn.collate || '';
    const engine = this.single.engine  || '';

    // var conn = builder.client.connectionSettings;
    if (charset)   sql += ` default character set ${charset}`;
    if (collation) sql += ` collate ${collation}`;
    if (engine)    sql += ` engine = ${engine}`;

    if (this.single.comment) {
      const comment = (this.single.comment || '');
      if (comment.length > 60) this.client.logger.warn('The max length for a table comment is 60 characters');
      sql += ` comment = '${comment}'`;
    }

    this.pushQuery(sql);
  },

  addColumnsPrefix: 'add ',

  alterColumnsPrefix: 'modify ',

  dropColumnPrefix: 'drop ',

  // Compiles the comment on the table.
  comment(comment) {
    this.pushQuery(`alter table ${this.tableName()} comment = '${comment}'`);
  },

  changeType() {
    // alter table + table + ' modify ' + wrapped + '// type';
  },

  index(columns, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('index', this.tableNameRaw, columns);
    this.pushQuery(`alter table ${this.tableName()} add index ${indexName}(${this.formatter.columnize(columns)})`);
  },

  primary(columns, constraintName) {
    constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
    this.pushQuery(`alter table ${this.tableName()} add primary key ${constraintName}(${this.formatter.columnize(columns)})`);
  },

  unique(columns, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('unique', this.tableNameRaw, columns);
    this.pushQuery(`alter table ${this.tableName()} add unique ${indexName}(${this.formatter.columnize(columns)})`);
  },

  // Compile a drop index command.
  dropIndex(columns, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('index', this.tableNameRaw, columns);
    this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
  },

  // Compile a drop foreign key command.
  dropForeign(columns, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('foreign', this.tableNameRaw, columns);
    this.pushQuery(`alter table ${this.tableName()} drop foreign key ${indexName}`);
  },

  // Compile a drop primary key command.
  dropPrimary() {
    this.pushQuery(`alter table ${this.tableName()} drop primary key`);
  },

  // Compile a drop unique key command.
  dropUnique(column, indexName) {
    indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('unique', this.tableNameRaw, column);
    this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
  }

})

export default TableCompiler_MySQL;
