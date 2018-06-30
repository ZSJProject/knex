
// MySQL Client
// -------
import inherits from 'inherits';

import Client from '../../client';

import QueryCompiler from './query/compiler';
import SchemaCompiler from './schema/compiler';
import TableCompiler from './schema/tablecompiler';
import ColumnCompiler from './schema/columncompiler';

import { assign } from 'lodash'
import { makeEscape } from '../../query/string'

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
function Client_MySQL(config) {
  Client.call(this, config);
}
inherits(Client_MySQL, Client);

assign(Client_MySQL.prototype, {

  dialect: 'mysql',

  driverName: 'mysql',

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

  _escapeBinding: makeEscape(),

  wrapIdentifierImpl(value) {
    return (value !== '*' ? `\`${value.replace(/`/g, '``')}\`` : '*')
  }

})

export default Client_MySQL
