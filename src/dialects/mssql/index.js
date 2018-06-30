
// MSSQL Client
// -------
import { assign } from 'lodash'
import inherits from 'inherits';

import Client from '../../client';

import Formatter from '../../formatter'
import QueryCompiler from './query/compiler';
import SchemaCompiler from './schema/compiler';
import TableCompiler from './schema/tablecompiler';
import ColumnCompiler from './schema/columncompiler';

// Always initialize with the "QueryBuilder" and "QueryCompiler" objects, which
// extend the base 'lib/query/builder' and 'lib/query/compiler', respectively.
function Client_MSSQL(config = {}) {
  Client.call(this, config);
}
inherits(Client_MSSQL, Client);

assign(Client_MSSQL.prototype, {

  dialect: 'mssql',

  driverName: 'mssql',

  formatter() {
    return new MSSQL_Formatter(this, ...arguments)
  },

  queryCompiler() {
    return new QueryCompiler(this, ...arguments)
  },

  schemaCompiler() {
    return new SchemaCompiler(this, ...arguments)
  },

  tableCompiler() {
    return new TableCompiler(this, ...arguments)
  },

  columnCompiler() {
    return new ColumnCompiler(this, ...arguments)
  },

  wrapIdentifierImpl(value) {
    return (value !== '*' ? `[${value.replace(/\[/g, '[')}]` : '*')
  },

  // Position the bindings for the query.
  positionBindings(sql) {
    let questionCount = -1
    return sql.replace(/\?/g, function() {
      questionCount += 1
      return `@p${questionCount}`
    })
  }
})

class MSSQL_Formatter extends Formatter {

  // Accepts a string or array of columns to wrap as appropriate.
  columnizeWithPrefix(prefix, target) {
    const columns = typeof target === 'string' ? [target] : target
    let str = '', i = -1;
    while (++i < columns.length) {
      if (i > 0) str += ', '
      str += prefix + this.wrap(columns[i])
    }
    return str
  }

}

export default Client_MSSQL
