
// MariaSQL Client
// -------
import inherits from 'inherits';
import Client_MySQL from '../mysql';

import { assign } from 'lodash'

function Client_MariaSQL(config) {
  Client_MySQL.call(this, config)
}
inherits(Client_MariaSQL, Client_MySQL)

assign(Client_MariaSQL.prototype, {

  dialect: 'mariadb',

  driverName: 'mariasql'

})

export default Client_MariaSQL
