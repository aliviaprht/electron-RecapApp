'use strict'
const path = require('path')
const model = require(path.join(__dirname, 'model.js'))

module.exports.showOrder = function (rowsObject) {
  let markup = ''
  for (let rowId in rowsObject) {
    let row = rowsObject[rowId]
    markup += '<div class="box-' + row.warna + '">' + 
    '<p class="font-weight-bold">' + row.nama_konsumen + '</p><p>' +
    row.jumlah + ' potong</p>' + '<button type="button" class="btn btn-primary btn-sm"  data-toggle="modal"' +
    'id="detail_' + row.id_order + '" data-target="#modalDetail_' + row.id_order + '">' + 'See Details </button>' +
    '<button type="button" class="btn btn-primary btn-sm"  data-toggle="modal"' +
    'id="detail_' + row.id_order + '" data-target="#modalNext_' + row.id_order + '">' + 'Next </button>'
    let proses = ''
    switch(row.proses){
      case 0: proses = '#LKO'; break;
      case 1: proses = '#TUNGGU_KAIN'; break;
      case 2: proses = '#POTONG'; break;
      case 3: proses = '#FILM'; break;
      case 4: proses = '#SABLON'; break;
      case 5: proses = '#JAHIT'; break;
      case 6: proses = '#PACKING'; break;
      case 7: proses = '#BELUM_KIRIM'; break;
      case 8: proses = '#SUDAH_KIRIM';
    }
    $(proses).append(markup);
  }
  $('#order-list button.detail').each(function (idx, obj) {
    $(obj).on('click', function () {
      window.view.showModal1(this.id)
    })
  })
  $('#order-list button.next').each(function (idx, obj) {
    $(obj).on('click', function () {
      window.view.showModal2(this.id)
    })
  })
}

module.exports.showModal1 = function (e) {
 
}

module.exports.showModal2 = function (e) {
  
}
