'use strict'
const path = require('path')
const model = require(path.join(__dirname, 'model.js'))
const SQL = require('sql.js')

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

//get letak_sablon by id
module.exports.getLetakSablonbyID = function (pid) {
    let db = SQL.dbOpen(window.model.db)
    if (db !== null) {
        let query = 'SELECT * FROM `letak_sablon` WHERE `id_produk` IS ?'
        let statement = db.prepare(query, [pid])
        try {
            if (statement.step()) {
                let values = [statement.get()]
                let columns = statement.getColumnNames()
                return _rowsFromSqlDataObject({values: values, columns: columns})
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
        let query = 'SELECT * FROM `warna` WHERE `id_produk` IS ?'
        let statement = db.prepare(query, [pid])
        try {
            if (statement.step()) {
                let values = [statement.get()]
                let columns = statement.getColumnNames()
                return _rowsFromSqlDataObject({values: values, columns: columns})
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
        let query = 'SELECT * FROM `pengiriman` WHERE `id_order` IS ? ORDER BY `urutan` ASC'
        let statement = db.prepare(query, [pid])
        try {
            if (statement.step()) {
                let values = [statement.get()]
                let columns = statement.getColumnNames()
                return _rowsFromSqlDataObject({values: values, columns: columns})
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

//get jumlah_pengiriman
module.exports.getJumlah_PengirimanbyID = function (pid) {
    let db = SQL.dbOpen(window.model.db)
    if (db !== null) {
        let query = 'SELECT * FROM `jumlah_pengiriman` WHERE `id_pengiriman` IS ?'
        let statement = db.prepare(query, [pid])
        try {
            if (statement.step()) {
                let values = [statement.get()]
                let columns = statement.getColumnNames()
                return _rowsFromSqlDataObject({values: values, columns: columns})
            } else {
                console.log('model.getJumlah_Pengiriman', 'No data found for id_pengiriman =', pid)
            }
        } catch (error) {
            console.log('model.getJumlah_Pengiriman', error.message)
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

