
import QueryInterface from '../query/methods';
import { assign } from 'lodash'

export default function makeKnex(client) {

  // The object we're potentially using to kick off an initial chain.
  function knex(tableName, options) {
    const qb = knex.queryBuilder()
    if (!tableName) client.logger.warn(
      'calling knex without a tableName is deprecated. Use knex.queryBuilder() instead.'
    );
    return tableName ? qb.table(tableName, options) : qb
  }

  assign(knex, {
    // A new query builder instance.
    queryBuilder() {
      return client.queryBuilder()
    },

    raw() {
      return client.raw.apply(client, arguments)
    },

    ref(ref) {
      return client.ref(ref);
    }

  })

  // Allow chaining methods from the root object, before
  // any other information is specified.
  QueryInterface.forEach(function(method) {
    knex[method] = function() {
      const builder = knex.queryBuilder()
      return builder[method].apply(builder, arguments)
    }
  })

  knex.client = client

  const VERSION = '0.12.6'

  Object.defineProperties(knex, {

    __knex__: {
      get() {
        knex.client.logger.warn(
          'knex.__knex__ is deprecated, you can get the module version' +
          "by running require('knex/package').version"
        )
        return VERSION
      }
    },

    VERSION: {
      get() {
        knex.client.logger.warn(
          'knex.VERSION is deprecated, you can get the module version' +
          "by running require('knex/package').version"
        )
        return VERSION
      }
    },

    schema: {
      get() {
        return client.schemaBuilder()
      }
    }

  })

  client.makeKnex = makeKnex

  return knex
}
