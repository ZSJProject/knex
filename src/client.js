import Raw from './raw';
import Ref from './ref';
import Formatter from './formatter';

import QueryBuilder from './query/builder';
import QueryCompiler from './query/compiler';

import SchemaBuilder from './schema/builder';
import SchemaCompiler from './schema/compiler';
import TableBuilder from './schema/tablebuilder';
import TableCompiler from './schema/tablecompiler';
import ColumnBuilder from './schema/columnbuilder';
import ColumnCompiler from './schema/columncompiler';

import inherits from 'inherits';
import { EventEmitter } from 'events';

import { makeEscape } from './query/string'
import { assign } from 'lodash'

import Logger from './logger';

// The base client provides the general structure
// for a dialect specific client object.
function Client(config = {}) {
  this.config = config
  this.logger = new Logger(config);

  //Client is a required field, so throw error if it's not supplied.
  //If 'this.dialect' is set, then this is a 'super()' call, in which case
  //'client' does not have to be set as it's already assigned on the client prototype.
  if(!this.dialect) {
    throw new Error(`knex: Required configuration option 'client' is missing.`)
  }

  this.valueForUndefined = this.raw('DEFAULT');

  if (config.useNullAsDefault) {
    this.valueForUndefined = null
  }
}
inherits(Client, EventEmitter)

assign(Client.prototype, {

  formatter(builder) {
    return new Formatter(this, builder)
  },

  queryBuilder() {
    return new QueryBuilder(this)
  },

  queryCompiler(builder) {
    return new QueryCompiler(this, builder)
  },

  schemaBuilder() {
    return new SchemaBuilder(this)
  },

  schemaCompiler(builder) {
    return new SchemaCompiler(this, builder)
  },

  tableBuilder(type, tableName, fn) {
    return new TableBuilder(this, type, tableName, fn)
  },

  tableCompiler(tableBuilder) {
    return new TableCompiler(this, tableBuilder)
  },

  columnBuilder(tableBuilder, type, args) {
    return new ColumnBuilder(this, tableBuilder, type, args)
  },

  columnCompiler(tableBuilder, columnBuilder) {
    return new ColumnCompiler(this, tableBuilder, columnBuilder)
  },

  raw() {
    return new Raw(this).set(...arguments)
  },

  ref() {
    return new Ref(this, ...arguments)
  },

  _formatQuery(sql, bindings, timeZone) {
    bindings = bindings == null ? [] : [].concat(bindings);
    let index = 0;
    return sql.replace(/\\?\?/g, (match) => {
      if (match === '\\?') {
        return '?'
      }
      if (index === bindings.length) {
        return match
      }
      const value = bindings[index++];
      return this._escapeBinding(value, {timeZone})
    })
  },

  _escapeBinding: makeEscape({
    escapeString(str) {
      return `'${str.replace(/'/g, "''")}'`
    }
  }),

  prepBindings(bindings) {
    return bindings;
  },

  positionBindings(sql) {
    return sql;
  },

  wrapIdentifier(value, queryContext) {
    return this.customWrapIdentifier(value, this.wrapIdentifierImpl, queryContext);
  },

  customWrapIdentifier(value, origImpl, queryContext) {
    if (this.config.wrapIdentifier) {
      return this.config.wrapIdentifier(value, origImpl, queryContext);
    }
    return origImpl(value);
  },

  wrapIdentifierImpl(value) {
    return (value !== '*' ? `"${value.replace(/"/g, '""')}"` : '*')
  },

  toString() {
    return '[object KnexClient]'
  }
})

export default Client
