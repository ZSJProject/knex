
import Client from './client';
import Raw from './raw';
import makeKnex from './util/make-knex';

// The client names we'll allow in the `{name: lib}` pairing.
const aliases = {
  'mariadb' : 'maria',
  'mariasql' : 'maria',
  'pg' : 'postgres',
  'postgresql' : 'postgres',
  'sqlite' : 'sqlite3'
};

export default function Knex(config) {
  let Dialect;
  const clientName = config.client || config.dialect;

  if(clientName){
    Dialect = require(`./dialects/${aliases[clientName] || clientName}/index.js`);
  }

  if(Dialect) return makeKnex(new Dialect(config));
  else return makeKnex(new Client());
}

/* eslint no-console:0 */

Object.defineProperties(Knex, {
  VERSION: {
    get() {
      console.warn(
        'Knex.VERSION is deprecated, you can get the module version' +
        "by running require('knex/package').version"
      );
      return '0.12.6'
    }
  }
});

Knex.Client = Client;

// Run a "raw" query, though we can't do anything with it other than put
// it in a query statement.
Knex.raw = (sql, bindings) => {
  console.warn('global Knex.raw is deprecated, use knex.raw (chain off an initialized knex object)')
  return new Raw().set(sql, bindings)
};
