
// Oracle Client
// -------
import { assign, map } from 'lodash'

import inherits from 'inherits';
import Client from '../../client';
import {bufferToString} from '../../query/string';
import Formatter from './formatter';

import QueryCompiler from './query/compiler';
import SchemaCompiler from './schema/compiler';
import ColumnBuilder from './schema/columnbuilder';
import ColumnCompiler from './schema/columncompiler';
import TableCompiler from './schema/tablecompiler';
import { ReturningHelper } from './utils';

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
export default function Client_Oracle(config) {
  Client.call(this, config)
}

inherits(Client_Oracle, Client)

assign(Client_Oracle.prototype, {

  dialect: 'oracle',

  driverName: 'oracle',

  formatter() {
    return new Formatter(this, ...arguments)
  },

  queryCompiler() {
    return new QueryCompiler(this, ...arguments)
  },

  schemaCompiler() {
    return new SchemaCompiler(this, ...arguments)
  },

  columnBuilder() {
    return new ColumnBuilder(this, ...arguments)
  },

  columnCompiler() {
    return new ColumnCompiler(this, ...arguments)
  },

  tableCompiler() {
    return new TableCompiler(this, ...arguments)
  },

  prepBindings(bindings) {
    return map(bindings, (value) => {
      // returning helper uses always ROWID as string
      if (value instanceof ReturningHelper && this.driver) {
        return new this.driver.OutParam(this.driver.OCCISTRING)
      }
      else if (typeof value === 'boolean') {
        return value ? 1 : 0
      }
      else if (Buffer.isBuffer(value)) {
        return bufferToString(value)
      }
      return value
    })
  },

  // Position the bindings for the query.
  positionBindings(sql) {
    let questionCount = 0
    return sql.replace(/\?/g, function() {
      questionCount += 1
      return `:${questionCount}`
    })
  }

})