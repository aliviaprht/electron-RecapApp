'use strict'
const path = require('path')
const model = require(path.join(__dirname, 'model.js'))
const detail = require(path.join(__dirname, 'detail.js'))

module.exports.showOrder = function (rowsObject) {
  console.log("show order")
  let markup = ''
  for (let rowId in rowsObject) {
    let row = rowsObject[rowId]
    markup += '<div class="box-process" style="background:'+row.warna+'">' +
              '<div class="font-weight-bold">'+row.nama_konsumen+'</div>'+
              '<div class="text-jumlah">'+row.jumlah+' potong</div>'+
              '<button type="button" class="btn btn-primary btn-sm detail" data-toggle="modal" data-target="#modalSeeDetails">'+
                  'Details' +
              '</button>' +
              '<button type="button" class="btn btn-success btn-sm next" data-toggle="modal" data-target="#modalNext">' +
                  'Next' +
              '</button>'+
              '</div>'
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

module.exports.showModal1 = function (pid) {
    //Get Order
    let rowOrder = detail.getOrderbyID(pid)
    $('#isiKodeArt').text(rowOrder[0].kode_artikel)
    $('#isiNamaArt').text(rowOrder[0].nama_artikel)
    $('#isiNoLKO').text(rowOrder[0].no_lko)

    //Get Produk
    let rowProduk = detail.getProdukbyID(pid)
    $('#isiJenisProduk').text(rowProduk[0].jenis_produk)
    $('#isiJenisBahan').text(rowProduk[0].jenis_bahan)
    $('#isiJenisSablon').text(rowProduk[0].jenis_sablon)

    //Get Letak Sablom
    let rowLetakSablon = detail.getLetakSablonbyID(rowProduk.id_produk)
    this.showLetakSablon(rowLetakSablon);

    //Get Warna
    let rowWarna = detail.getWarnabyID(rowProduk.id_produk)
    this.showWarna(rowWarna);

    //Get Konsumen
    let rowKons = detail.getKonsumenbyID(rowOrder.id_konsumen)[0]
    $('#isiNamaKonsumen').text(rowKons.nama_konsumen)

    //Get Pengiriman
    let rowKirim = detail.getPengirimanbyID(pid)
    this.showWarna(rowKirim)

    //Get Tanggal
    //belom pake if-if-an
    let date = detail.getTanggal_ProsesbyID(pid)[0]
    $('#isiLKO').text(date.LKO)
    if (date.TUNGGU_KAIN != "") {
        $('#isiTungguKain').text(date.TUNGGU_KAIN)
    }
    if (date.POTONG != "") {
        $('#isiPotong').text(date.POTONG)
    }
    if (date.FILM != "") {
        $('#isiFilm').text(date.FILM)
    }
    if (date.SABLON != "") {
        $('#isiSablon').text(date.SABLON)
    }
    if (date.JAHIT != "") {
        $('#isiJahit').text(date.JAHIT)
    }
    if (date.PACKING != "") {
        $('#isiPacking').text(date.PACKING)
    }
    if (date.BELUM_KIRIM != "") {
        $('#isiBelumKirim').text(date.BELUM_KIRIM)
    }
    if (date.SUDAH_KIRIM != "") {
        $('#isiSudahKirim').text(date.SUDAH_KIRIM)
    }
}

module.exports.showWarna = function (rowsObject) {
    let markup = ''
    for (let rowId in rowsObject) {
        let row = rowsObject[rowId]
        markup += '<li>' + row.warna_bahan + '</li>'
        $('#isiWarnaBahan').append(markup)
    }
}

module.exports.showLetakSablon = function (rowsObject) {
    let markup = ''
    for (let rowId in rowsObject) {
        let row = rowsObject[rowId]
        markup += '<li>' + row.warna_bahan + '</li>'
        $('#isiLetakSablon').append(markup)
    }
}

module.exports.showPengiriman = function (rowsObject) {
    let markup =''
    for (let rowId in rowsObject) {
        let rowPengiriman = detail.getJumlah_PengirimanbyID(rowsObject[rowId].id_pengiriman)
        let urutan = rowsObject[rowId].urutan
            markup += '<div class="row"> <span class="font-weight-bold namaInfo">Pengiriman - ' +
                '</span><span>' + urutan + '</span></div> <div class="row"> <div class="col-4"> ' +
                '<span class="font-weight-bold namaInfo">Uk. 2  : </span> <span>' + rowPengiriman.size_2 +
                '</span> </div> <div class="col-4"> <span class="font-weight-bold namaInfo">Uk. 12 : </span> ' +
                '<span>' + rowPengiriman.size_12 + '</span> </div> <div class="col-4"> <span class="font-weight-bold' +
                ' namaInfo">Uk. L  : </span> <span>'+ rowPengiriman.size_L +'</span> </div> </div> <div class="row"> ' +
                '<div class="col-4"> <span class="font-weight-bold namaInfo">Uk. 4  : </span> <span>'+
                rowPengiriman.size_4 + '</span> </div> <div class="col-4"> <span class="font-weight-bold ' +
                'namaInfo">Uk. XS : </span> <span>'+ rowPengiriman.size_XS + '</span> </div> <div class="col-4"> ' +
                '<span class="font-weight-bold namaInfo">Uk. XL : </span> <span>'+ rowPengiriman.size_XL +'</span> ' +
                '</div> </div> <div class="row"> <div class="col-4"> <span class="font-weight-bold namaInfo">' +
                'Uk. 6  : </span> <span>'+ rowPengiriman.size_6 +'</span> </div> <div class="col-4"> <span ' +
                'class="font-weight-bold namaInfo">Uk. S  : </span> <span>'+ rowPengiriman.size_S +'</span> ' +
                '</div> <div class="col-4"> <span class="font-weight-bold namaInfo">Uk. 3L : </span> ' +
                '<span>'+ rowPengiriman.size_3L +'</span> </div> </div> <div class="row"> <div class="col-4"> ' +
                '<span class="font-weight-bold namaInfo">Uk. 8  : </span> <span>'+ rowPengiriman.size_8 +'</span> ' +
                '</div> <div class="col-4"> <span class="font-weight-bold namaInfo">Uk. M  : </span> ' +
                '<span>'+ rowPengiriman.size_M +'</span> </div> <div class="col-4"> <span class="font-weight-bold ' +
                'namaInfo">Uk. 4L : </span> <span>'+ rowPengiriman.size_4L +'</span> </div> </div> <div class="row"> ' +
                '<div class="col-4"> <span class="font-weight-bold namaInfo">Uk. 10 : </span> ' +
                '<span>'+ rowPengiriman.size_10 +'</span> </div> </div>'

        $('#isiKirim').append(markup)
    }

}
module.exports.showModal2 = function (e) {
  
}
