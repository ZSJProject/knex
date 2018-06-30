
// SQLite3
// -------

import inherits from 'inherits';
import { isUndefined, assign } from 'lodash'

import Client from '../../client';

import QueryCompiler from './query/compiler';
import SchemaCompiler from './schema/compiler';
import ColumnCompiler from './schema/columncompiler';
import TableCompiler from './schema/tablecompiler';

function Client_SQLite3(config) {
  Client.call(this, config)

  if (isUndefined(config.useNullAsDefault)) {
    this.logger.warn(
      'sqlite does not support inserting default values. Set the ' +
      '`useNullAsDefault` flag to hide this warning. ' +
      '(see docs http://knexjs.org/#Builder-insert).'
    );
  }
}
inherits(Client_SQLite3, Client)

assign(Client_SQLite3.prototype, {

  dialect: 'sqlite3',

  driverName: 'sqlite3',

  schemaCompiler() {
    return new SchemaCompiler(this, ...arguments)
  },

  queryCompiler() {
    return new QueryCompiler(this, ...arguments)
  },

  columnCompiler() {
    return new ColumnCompiler(this, ...arguments)
  },

  tableCompiler() {
    return new TableCompiler(this, ...arguments)
  },

  wrapIdentifierImpl(value) {
    return (value !== '*' ? `\`${value.replace(/`/g, '``')}\`` : '*')
  }
})

export default Client_SQLite3
