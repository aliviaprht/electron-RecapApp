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
  let dbPath = path.join(appPath, 'example.db')
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
    var date = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate();
    let query = 'SELECT id_order,nama_konsumen,warna,jumlah,proses FROM `order` NATURAL JOIN `konsumen` NATURAL JOIN `tanggal_proses`' + 
     'WHERE `proses` < 8 OR `SUDAH_KIRIM` =' + date;
    try {
      let row = db.exec(query)
      if (row !== undefined && row.length > 0) {
        row = _rowsFromSqlDataObject(row[0])
        view.showOrder(row)
      }
    } catch (error) {
      console.log('model.getOrder', error.message)
    } finally {
      console.log('success get order')
      SQL.dbClose(db, window.model.db)
    }
  }
}
module.exports.addorderdumb =function(){
    let db = SQL.dbOpen(window.model.db)
    if (db !== null) {
      let query = 'INSERT INTO `order` VALUES (null,"kodeart","dumb","no lko",1,10,1)'
      let statement = db.prepare(query)
      try {
        if (statement.run()) {
          console.log('success addorderdumb')
        } else {
        console.log('Query failed for addorderdumb')
        }
      } catch (error) {
        console.log('model.addorderdumb', error.message)
      } finally {
        SQL.dbClose(db, window.model.db)
      }
    }
}
module.exports.addkonsumendumb =function(){
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'INSERT INTO `konsumen` VALUES (null,"ibu susi","blue")'
    let statement = db.prepare(query)
    try {
      if (statement.run()) {
        console.log('success addkonsumendumb')
      } else {
        console.log('Query failed for addkonsumendumb')
      }
    } catch (error) {
      console.log('model.addkonsumendumb', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}
module.exports.addprosesdumb=function(id_order){
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let query = 'INSERT INTO tanggal_proses(id_order,LKO) VALUES('+id_order+',"'+date+'")'
    console.log(query)
    let statement = db.prepare(query)
    try {
      if (statement.run()) {
        console.log('success addprosesdumb')
      } else {
        console.log('Query failed for addprosesdumb')
      }
    } catch (error) {
      console.log('model.addprosesdumb', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}
module.exports.addDumb = function(){
  window.model.addorderdumb()
  window.model.addkonsumendumb()
  let values, columns = null;
    let db = SQL.dbOpen(window.model.db)
    if (db !== null) {
      let query = 'SELECT id_order FROM `order` WHERE `kode_artikel` = "kodeart"'
      let statement = db.prepare(query)
      try {
        if (statement.step()) {
          values = [statement.get()]
          columns = statement.getColumnNames()
          console.log(values)
        } else {
          console.log('model.addDumb', 'No data found for kode_artikel="kodeart"')
        }
      } catch (error) {
        console.log('model.addDumb', error.message)
      } finally {
        SQL.dbClose(db, window.model.db)
      }
    }
  if(values!=null){
    window.model.addprosesdumb(values)
  }
}
/*
  Fetch a person's data from the database.
*/
module.exports.getOrderbyID = function (pid) {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'SELECT * FROM `order` NATURAL JOIN `konsumen` WHERE `id_order` IS ?'
    let statement = db.prepare(query, [pid])
    try {
      if (statement.step()) {
        let values = [statement.get()]
        let columns = statement.getColumnNames()
        return _rowsFromSqlDataObject({values: values, columns: columns})
      } else {
        console.log('model.getPeople', 'No data found for id =', pid)
      }
    } catch (error) {
      console.log('model.getPeople', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}
module.exports.getAllKonsumenColor = function () {
  let db = SQL.dbOpen(window.model.db)
  if (db !== null) {
    let query = 'SELECT `warna` FROM `konsumen`'
    let statement = db.prepare(query)
    try {
      if (statement.step()) {
        let values = [statement.get()]
        let columns = statement.getColumnNames()
        console.log("success getAllKonsumenColor")
        return _rowsFromSqlDataObject({values: values, columns: columns})
      } else {
        return null
        console.log('model.getAllKonsumenColor', 'No color')
      }
    } catch (error) {
      console.log('model.getAllKonsumenColor', error.message)
    } finally {
      SQL.dbClose(db, window.model.db)
    }
  }
}
module.exports.getKonsumenbyName = function (name) {
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
        return null
        console.log('model.getKonsumenbyName', 'No data found for nama =', nama)
      }
    } catch (error) {
      console.log('model.getKonsumenbyName', error.message)
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
    let query = 'SELECT * FROM `order` NATURAL JOIN `konsumen` WHERE `kode_artikel` IS ?'
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
      let statement = db.prepare(query)
      try {
        if (statement.run(keyValue.values)) {
          $('#' + keyValue.columns.join(', #'))
          .addClass('form-control-success')
          .animate({class: 'form-control-success'}, 1500, function () {
            if (typeof callback === 'function') {
              callback()
            }
          })
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