'use strict'

const path = require('path')
const fs = require('fs')
const SQL = require('sql.js')
const view = require(path.join(__dirname, 'view.js'))
/*
  SQL.js returns a compact object listing the columns separately from the
  values or rows of data. This function joins the column names and
  values into a single objects and collects these together by row id.
  {
    0: {first_name: "Jango", last_name: "Reinhardt", person_id: 1},
    1: {first_name: "Svend", last_name: "Asmussen", person_id: 2},
  }
  This format makes updating the markup easy when the DOM input id attribute
  is the same as the column name. See view.showPeople() for an example.
*/
let _rowsFromSqlDataObject = function (object) {
  let data = {}
  let i = 0
  let j = 0
  for (let valueArray of object.values) {
    data[i] = {}
    j = 0
    for (let column of object.columns) {
      Object.assign(data[i], {[column]: valueArray[j]})
      j++
    }
    i++
  }
  console.log(data)
  return data
}

/*
  Return a string of placeholders for use in a prepared statement.
*/
let _placeHoldersString = function (length) {
  let places = ''
  for (let i = 1; i <= length; i++) {
    places += '?, '
  }
  return /(.*),/.exec(places)[1]
}

SQL.dbOpen = function (databaseFileName) {
  try {
    return new SQL.Database(fs.readFileSync(databaseFileName))
  } catch (error) {
    console.log("Can't open database file.", error.message)
    return null
  }
}

SQL.dbClose = function (databaseHandle, databaseFileName) {
  try {
    let data = databaseHandle.export()
    let buffer = new Buffer(data)
    fs.writeFileSync(databaseFileName, buffer)
    databaseHandle.close()
    return true
  } catch (error) {
    console.log("Can't close database file.", error)
    return null
  }
}

/*
  A function to create a new SQLite3 database from schema.sql.
  This function is called from main.js during initialization and that's why
  it's passed appPath. The rest of the model operates from renderer and uses
  window.model.db.
*/
module.exports.initDb = function (appPath, callback) {
  let dbPath = path.join(appPath, 'order.db')
  let createDb = function (dbPath) {
    // Create a database.
    let db = new SQL.Database()
    let query = fs.readFileSync(
    path.join(__dirname, 'db', 'schema.sql'), 'utf8')
    let result = db.exec(query)
    if (Object.keys(result).length === 0 &&
      typeof result.constructor === 'function' &&
      SQL.dbClose(db, dbPath)) {
      console.log('Created a new database.')
    } else {
      console.log('model.initDb.createDb failed.')
    }
  }
  let db = SQL.dbOpen(dbPath)
  if (db === null) {
    /* The file doesn't exist so create a new database. */
    createDb(dbPath)
    console.log('create new DB cause null')
  } else {
    /*
      The file is a valid sqlite3 database. This simple query will demonstrate
      whether it's in good health or not.
    */
    let query = 'SELECT count(*) as `count` FROM `sqlite_master`'
    let row = db.exec(query)
    let tableCount = parseInt(row[0].values)
    if (tableCount === 0) {
      console.log('The file is an empty SQLite3 database.')
      createDb(dbPath)
    } else {
      console.log('The database has', tableCount, 'tables.')
    }
    if (typeof callback === 'function') {
      callback()
    }
  }
}

/*
  Get order to be shown today.
*/
module.exports.getOrder = function () {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let query = 'SELECT id_order,nama_konsumen,warna,jumlah,proses,jenis_produk FROM `order` NATURAL JOIN `konsumen` NATURAL JOIN `tanggal_proses` NATURAL JOIN `produk`' + 
     'WHERE `proses` < 9';
    try {
      let row = db.exec(query)
      if (row !== undefined && row.length > 0) {
        console.log("hasilgetorder:",row[0])
        row = _rowsFromSqlDataObject(row[0])
      }
      view.showOrder(row)
    } catch (error) {
      console.log('model.getOrder', error.message)
    } finally {
      console.log('success get order')
      SQL.dbClose(db, window.model.db)
    }
  }
}

module.exports.getSearchOrder = function (code) {
    let db = SQL.dbOpen(window.model.db)
    if (db != null) {
        let query = 'SELECT * FROM `order` NATURAL JOIN `produk` NATURAL JOIN `konsumen` NATURAL JOIN `tanggal_proses` WHERE `kode_artikel` LIKE "%'+ code +'%"'+
                    'OR `no_lko` LIKE "%'+ code +'%" OR `nama_konsumen` LIKE "%'+ code +'%" OR `nama_artikel` LIKE "%'+ code +'%"  OR `jenis_produk` LIKE "%'+ code +'%" '+
                    'OR `jenis_bahan` LIKE "%'+ code +'%"'
        try {
            let row = db.exec(query)
            if (row !== undefined && row.length > 0) {
                row = _rowsFromSqlDataObject(row[0])
                view.showOrder(row)
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log('model.getSearchOrder', error.message)
            return false
        } finally {
            SQL.dbClose(db, window.model.db)
        }
    }
}

//get produk by id
module.exports.getProdukbyID = function (pid) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT * FROM `produk` WHERE `id_order` IS ?'
      let statement = db.prepare(query, [pid])
      try {
          if (statement.step()) {
              let values = [statement.get()]
              let columns = statement.getColumnNames()
              return _rowsFromSqlDataObject({values: values, columns: columns})
          } else {
              console.log('model.getProduk', 'No data found for id_order =', pid)
          }
      } catch (error) {
          console.log('model.getProduk', error.message)
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}

//get order by id
module.exports.getOrderbyID = function (pid) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT * FROM `order` WHERE `id_order` IS ?'
      let statement = db.prepare(query, [pid])
      try {
          if (statement.step()) {
              let values = [statement.get()]
              let columns = statement.getColumnNames()
              return _rowsFromSqlDataObject({values: values, columns: columns})
          } else {
              console.log('model.getOrder', 'No data found for id_order =', pid)
          }
      } catch (error) {
          console.log('model.getOrder', error.message)
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}
module.exports.getAllKonsumen = function () {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'SELECT * FROM `konsumen`'
    let statement = db.prepare(query)
    try {
      let row = db.exec(query)
      if (row !== undefined && row.length > 0) {
        row = _rowsFromSqlDataObject(row[0])
        return row
      }else{
        return null
      }
    } catch (error) {
      console.log('model.getAllKonsumenColor', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}
module.exports.getKonsumenbyName = function (nama) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'SELECT * FROM `konsumen` WHERE `nama_konsumen` IS ?'
    let statement = db.prepare(query, [nama])
    try {
      if (statement.step()) {
        let values = [statement.get()]
        let columns = statement.getColumnNames()
        return _rowsFromSqlDataObject({values: values, columns: columns})
      } else {
        console.log('model.getKonsumenbyName', 'No data found for nama =', nama)
        return null
      }
    } catch (error) {
      console.log('model.getKonsumenbyName', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}
//get konsumen by id
module.exports.getKonsumenbyID = function (pid) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT * FROM `konsumen` WHERE `id_konsumen` IS ?'
      let statement = db.prepare(query, [pid])
      try {
          if (statement.step()) {
              let values = [statement.get()]
              let columns = statement.getColumnNames()
              return _rowsFromSqlDataObject({values: values, columns: columns})
          } else {
              console.log('model.getKonsumen', 'No data found for id_konsumen =', pid)
          }
      } catch (error) {
          console.log('model.getKonsumen', error.message)
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}
/*
  Fetch a person's data from the database.
*/
module.exports.getOrderbyArticle = function (code) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'SELECT * FROM `order` WHERE `kode_artikel` IS ?'
    let statement = db.prepare(query, [code])
    try {
      if (statement.step()) {
        let values = [statement.get()]
        let columns = statement.getColumnNames()
        return _rowsFromSqlDataObject({values: values, columns: columns})
      } else {
        console.log('model.getPeople', 'No data found for kode_artikel =', code)
      }
    } catch (error) {
      console.log('model.getPeople', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}

//get letak_sablon by id
module.exports.getLetakSablonbyID = function (pid) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT * FROM `letak_sablon` WHERE `id_produk` IS '+pid
      try {
        let row = db.exec(query)
        if (row !== undefined && row.length > 0) {
          row = _rowsFromSqlDataObject(row[0])
          return row
        } else {
              console.log('model.getLetakSablon', 'No data found for id_produk =', pid)
        }
      } catch (error) {
          console.log('model.getLetakSablon', error.message)
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}
//get warna by id
module.exports.getWarnabyID = function (pid) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT * FROM `warna` WHERE `id_produk` IS '+pid
      try {
        let row = db.exec(query)
        if (row !== undefined && row.length > 0) {
          row = _rowsFromSqlDataObject(row[0])
          return row
        } else {
              console.log('model.getWarna', 'No data found for id_produk =', pid)
        }
      } catch (error) {
          console.log('model.getWarna', error.message)
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}
//get pengiriman by id
module.exports.getPengirimanbyID = function (pid) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT * FROM `pengiriman` WHERE `id_order` IS '+pid+' ORDER BY `urutan` ASC'
      try {
        let row = db.exec(query)
        if (row !== undefined && row.length > 0) {
          row = _rowsFromSqlDataObject(row[0])
          return row
        } else {
              console.log('model.getPengiriman', 'No data found for id_order =', pid)
          }
      } catch (error) {
          console.log('model.getPengiriman', error.message)
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}
//get tanggal_proses by id
module.exports.getTanggal_ProsesbyID = function (pid) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT * FROM `tanggal_proses` WHERE `id_order` IS ?'
      let statement = db.prepare(query, [pid])
      try {
          if (statement.step()) {
              let values = [statement.get()]
              let columns = statement.getColumnNames()
              return _rowsFromSqlDataObject({values: values, columns: columns})
          } else {
              console.log('model.getTanggal_Proses', 'No data found for id_order =', pid)
          }
      } catch (error) {
          console.log('model.getTanggal_Proses', error.message)
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}
module.exports.getAllKodeArtikel = function () {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT `kode_artikel` FROM `order`'
      try {
        let row = db.exec(query)
        if (row !== undefined && row.length > 0) {
          row = _rowsFromSqlDataObject(row[0])
          return row
        } else {
          return []
              console.log('model.getAllKodeArtikel', 'No data found')
          }
      } catch (error) {
          console.log('model.getKodeArtikel', error.message)
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}
module.exports.getAllNoLKO = function () {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT `no_lko` FROM `order`'
      try {
        let row = db.exec(query)
        if (row !== undefined && row.length > 0) {
          row = _rowsFromSqlDataObject(row[0])
          return row
        } else {
          return []
              console.log('model.getAllNoLKO', 'No data found')
          }
      } catch (error) {
          console.log('model.getAllNoLKO', error.message)
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}
module.exports.getHistory = function (limit,offset) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
      let query = 'SELECT `id_log`, `id_order`, `nama_konsumen`, `hari`, `tanggal`, `proses_baru`, `jenis_produk`, `kode_artikel`,`warna`'+
                  'FROM `order` NATURAL JOIN `konsumen` NATURAL JOIN `produk` NATURAL JOIN (SELECT * FROM `log`  ORDER BY `timestamp` DESC LIMIT '+limit+' OFFSET '+offset+')'
      try {
        let row = db.exec(query)
        if (row !== undefined && row.length > 0) {
          row = _rowsFromSqlDataObject(row[0])
          view.showHistory(row)
          return true
        } else {
              console.log('model.getHistory', 'No data found')
            return false
          }
      } catch (error) {
          console.log('model.getHistory', error.message)
          return false
      } finally {
          SQL.dbClose(db, window.model.db)
      }
  }
}
/*
  Insert or update a order's data in the database.
*/
module.exports.saveFormData = function (tableName, keyValue, callback) {
  if (keyValue.columns.length > 0) {
    let db = SQL.dbOpen(window.model.db)
    if (db !== null) {
      let query = 'INSERT OR REPLACE INTO `' + tableName
      query += '` (`' + keyValue.columns.join('`, `') + '`)'
      query += ' VALUES (' + _placeHoldersString(keyValue.values.length) + ')'
      console.log(query)
      let statement = db.prepare(query)
      try {
        if (statement.run(keyValue.values)) {
          console.log("model.saveFormData to ",tableName)
        } else {
          console.log('model.saveFormData', 'Query failed for', keyValue.values)
        }
      } catch (error) {
        console.log('model.saveFormData', error.message)
      } finally {
        SQL.dbClose(db, window.model.db)
      }
    }
  }
}
module.exports.updateData = function(tablename,column,value,condition){
    let db = SQL.dbOpen(window.model.db)
    if (db !== null) {
      let query = 'UPDATE `' + tablename +'` SET `'+column+'`='+value+' WHERE '+condition
      console.log(query)
      let statement = db.prepare(query)
      try {
        if (statement.run()) {
          console.log("model.updateData to ",tablename)
        } else {
          console.log('model.updateData', 'Query failed')
        }
      } catch (error) {
        console.log("model.updateData", error.message)
      } finally {
        SQL.dbClose(db, window.model.db)
      }
    }
}
module.exports.deleteOrderbyID = function (id, callback) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'DELETE FROM `order` WHERE `id` IS ?'
    let statement = db.prepare(query)
    try {
      if (statement.run([id])) {
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        console.log('model.deletePerson', 'No data found for id_order =',id)
      }
    } catch (error) {
      console.log('model.deletePerson', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}
module.exports.deleteOrderbyArticle = function (code, callback) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'DELETE FROM `order` WHERE `kode_artikel` IS ?'
    let statement = db.prepare(query)
    try {
      if (statement.run([code])) {
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        console.log('model.deletePerson', 'No data found for kode_artikel =',code)
      }
    } catch (error) {
      console.log('model.deletePerson', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}
module.exports.deleteHistory = function (ids) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let args = ids.join(", ")
    console.log("delete log"+args)
    let query = "DELETE FROM `log` WHERE `id_log` IN ("+args+")"
    let statement = db.prepare(query)
    try {
      if (statement.run()) {
        console.log('model.deleteHistory success')
      } else {
        console.log('model.deleteHistory', 'No data found for id =',args)
      }
    } catch (error) {
      console.log('model.deleteHistory', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}