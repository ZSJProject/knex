
// PostgreSQL
// -------
import { assign } from 'lodash'
import inherits from 'inherits';
import Client from '../../client';

import QueryCompiler from './query/compiler';
import ColumnCompiler from './schema/columncompiler';
import TableCompiler from './schema/tablecompiler';
import SchemaCompiler from './schema/compiler';
import {makeEscape} from '../../query/string'

function Client_PG(config) {
  Client.apply(this, arguments);
  if (config.returning) {
    this.defaultReturning = config.returning;
  }

  if (config.searchPath) {
    this.searchPath = config.searchPath;
  }

  if (config.version) {
    this.version = config.version;
  }
}
inherits(Client_PG, Client);

assign(Client_PG.prototype, {

  queryCompiler() {
    return new QueryCompiler(this, ...arguments)
  },

  columnCompiler() {
    return new ColumnCompiler(this, ...arguments)
  },

  schemaCompiler() {
    return new SchemaCompiler(this, ...arguments)
  },

  tableCompiler() {
    return new TableCompiler(this, ...arguments)
  },

  dialect: 'postgresql',

  driverName: 'pg',

  _escapeBinding: makeEscape({
    escapeArray(val, esc) {
      return esc(arrayString(val, esc))
    },
    escapeString(str) {
      let hasBackslash = false
      let escaped = '\''
      for (let i = 0; i < str.length; i++) {
        const c = str[i]
        if (c === '\'') {
          escaped += c + c
        } else if (c === '\\') {
          escaped += c + c
          hasBackslash = true
        } else {
          escaped += c
        }
      }
      escaped += '\''
      if (hasBackslash === true) {
        escaped = 'E' + escaped
      }
      return escaped
    },
    escapeObject(val, prepareValue, timezone, seen = []) {
      if (val && typeof val.toPostgres === 'function') {
        seen = seen || [];
        if (seen.indexOf(val) !== -1) {
          throw new Error(`circular reference detected while preparing "${val}" for query`);
        }
        seen.push(val);
        return prepareValue(val.toPostgres(prepareValue), seen);
      }
      return JSON.stringify(val);
    }
  }),

  wrapIdentifierImpl(value) {
    if (value === '*') return value;

    let arrayAccessor = '';
    const arrayAccessorMatch = value.match(/(.*?)(\[[0-9]+\])/);

    if (arrayAccessorMatch) {
      value = arrayAccessorMatch[1];
      arrayAccessor = arrayAccessorMatch[2];
    }

    return `"${value.replace(/"/g, '""')}"${arrayAccessor}`;
  },

  // Position the bindings for the query. The escape sequence for question mark
  // is \? (e.g. knex.raw("\\?") since javascript requires '\' to be escaped too...)
  positionBindings(sql) {
    let questionCount = 0;
    return sql.replace(/(\\*)(\?)/g, function (match, escapes) {
      if (escapes.length % 2) {
        return '?';
      } else {
        questionCount++;
        return `$${questionCount}`;
      }
    });
  }
})

function arrayString(arr, esc) {
  let result = '{'
  for (let i = 0 ; i < arr.length; i++) {
    if (i > 0) result += ','
    const val = arr[i]
    if (val === null || typeof val === 'undefined') {
      result += 'NULL'
    } else if (Array.isArray(val)) {
      result += arrayString(val, esc)
    } else if (typeof val === 'number') {
      result += val
    } else {
      result += JSON.stringify(typeof val === 'string' ? val : esc(val))
    }
  }
  return result + '}'
}

export default Client_PG
