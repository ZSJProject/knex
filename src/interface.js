
import { isArray, map, clone } from 'lodash'

export default function(Target) {

  Target.prototype.toQuery = function(tz) {
    let data = this.toSQL(this._method, tz);
    if (!isArray(data)) data = [data];
    return map(data, (statement) => {
      return this.client._formatQuery(statement.sql, statement.bindings, tz);
    }).join(';\n');
  };

  // Add additional "options" to the builder. Typically used for client specific
  // items, like the `mysql` and `sqlite3` drivers.
  Target.prototype.options = function(opts) {
    this._options = this._options || [];
    this._options.push(clone(opts) || {});
    return this;
  };

  // Set a debug flag for the current schema query stack.
  Target.prototype.debug = function(enabled) {
    this._debug = arguments.length ? enabled : true;
    return this;
  };
}
