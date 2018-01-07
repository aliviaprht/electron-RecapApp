'use strict'
const path = require('path')
const model = require(path.join(__dirname, 'model.js'))
module.exports.getMaxHeight = function(){
  let maxheight=0;
  $.each($('.col-process'), function(){
      console.log($(this).height())            
    if($(this).height()>maxheight){
        maxheight = $(this).height()
    }
  }); 
  console.log("max:"+maxheight)
  return maxheight
}
module.exports.setToMaxHeight = function(max){
    console.log(max)
    $.each($('.col-process'), function(){         
      $(this).height(max)
    }); 
}
module.exports.showHistory = function(rowsObject){
    console.log('show history')
    for (let rowId in rowsObject) {
        let markup = ''
        let row = rowsObject[rowId]
        let status =''
        switch(row.proses_baru){
            case 0: status = ' diterima'; break;
            case 1: status = ' masuk ke proses TUNGGU KAIN'; break;
            case 2: status = ' masuk ke proses POTONG'; break;
            case 3: status = ' masuk ke proses FILM'; break;
            case 4: status = ' masuk ke proses SABLON'; break;
            case 5: status = ' masuk ke proses JAHIT'; break;
            case 6: status = ' masuk ke proses PACKING'; break;
            case 7: status = ' sudah PACKING, masuk ke tahap BELUM KIRIM'; break;
            default: status = ' SUDAH DIKIRIM';
          }
        markup += '<div class="row" id="history_'+row.id_log+'">'+
                    '<div class="col-sm-1">'+
                        '<input type="checkbox" name="deletehistory" value="delete_'+row.id_order+'">'+
                    '</div>'+
                    '<div class="col-sm-3 kode_artikel" id="isiKodeArt_'+row.id_order+'">'+row.kode_artikel+'</div>'+
                    '<div class="col-sm-7">'+
                        '<span>Order</span>'+
                        '<span id="isiJenisOrder"> '+row.jenis_produk+'</span>'+
                        '<span> dari</span>'+
                        '<span id="isiNamaKonsumen"> '+row.nama_konsumen+'</span>'+
                        '<span>'+status+'</span>'+
                    '</div>'+
                    '<div class="col-sm-1 dropdown">'+
                        '<a class="test clickable" id="option_'+row.id_log+'" style="width:30px;"></a>'+
                        '<div id="menu_'+row.id_log+'" class="dropdown-content">'+
                            '<a class="btn left" id="history-delete_'+row.id_log+'" name="delete">Delete</a>'+
                            '<a class="btn left" id="history-detail_'+row.id_log+'" name="detail">See Details</a>'+
                        '</div>'+
                    '</div>'+
                    '</div>'
        if(!$('#content_'+row.tanggal).length){
            let day = ''
            let month = ''
            switch(row.hari){
                case 1: day = 'Senin'; break;
                case 2: day = 'Selasa'; break;
                case 3: day = 'Rabu'; break;
                case 4: day = 'Kamis'; break;
                case 5: day = 'Jumat'; break;
                case 6: day = 'Sabtu'; break;
                case 0: day = 'Minggu'; break;
            }
            console.log('month '+row.tanggal.split('-')[1])
            switch(parseInt(row.tanggal.split('-')[1])){
                case 1: month = 'Januari'; break;
                case 2: month = 'Februari'; break;
                case 3: month = 'Maret'; break;
                case 4: month = 'April'; break;
                case 5: month = 'Mei'; break;
                case 6: month = 'Juni'; break;
                case 7: month = 'Juli'; break;
                case 8: month = 'Agustus'; break;
                case 9: month = 'September'; break;
                case 10: month = 'Oktober'; break;
                case 11: month = 'November'; break;
                case 12: month = 'Desember'; break;
            }
            console.log('month '+month)
            let card ='<div class="container-history card" id="history_'+row.tanggal+'">'+
            '<div class="namaInfo card-header">'+day+', '+row.tanggal.split('-')[0]+' '+month+' '+row.tanggal.split('-')[2]+' </div>'+
            '<div class="card-body" id="content_'+row.tanggal+'">'+
            '<div>'+
            '<div>'
            $('#history-found').append(card)
        }
        $('#content_'+row.tanggal).append(markup)
    }
    $('.kode_artikel').each(function (idx, obj) {
        $(obj).on('click', function () {
          console.log("detail id="+this.id.split('_')[1])
          window.view.showModal1(this.id.split('_')[1])
        })
      })
      $('.dropdown-content').hide()
      $('a.test').each(function (idx, obj) {
        $(obj).on('click', function () {
          console.log("option id="+this.id.split('_')[1])
          if($('#menu_'+this.id.split('_')[1]).is(':visible')){
            $('#menu_'+this.id.split('_')[1]).hide()
          }else{
            $('#menu_'+this.id.split('_')[1]).show()
          }
        })
      })
      $('a[name="delete"]').each(function (idx, obj) {
        $(obj).on('click', function () {
          console.log("delete id="+this.id.split('_')[1])
          model.deleteHistory([parseInt(this.id.split('_')[1])])
          $('#history_'+this.id.split('_')[1]).remove()
        })
      })
      $('a[name="detail"]').each(function (idx, obj) {
        $(obj).on('click', function () {
            console.log("detail id="+this.id.split('_')[1])
            window.view.showModal1(this.id.split('_')[1])
        })
      })
      $('.container-history card-body').each(function (idx, obj) {
        if(!$.trim( $(obj).html() ).length) {
            console.log("empty")
            $('#content_'+this.id.split('_')[1]).remove()
        }
      })
      window.onclick = function(e) {
        if (!e.target.matches('a.test')) {
          if($('.dropdown-content').is(':visible')){
            $('.dropdown-content').hide()
          }
        }
      }
      $.each($("input[name='deletehistory']"), function(idx, obj){            
        $(obj).on('click', function () {
           if($(obj).prop("checked")){
                window.view.addcheck()
           }else{
                window.view.removecheck()
           }
           if(parseInt($("#allcheck").val())==0){
               $('#to-delete-history').hide()
               $('#head').show()
           }else{
               $('.number-delete').html($("#allcheck").val()+" selected")
               $('#head').hide()
               $('#to-delete-history').show()
           }
        })
      }); 
}
module.exports.addcheck = function(){
    var allcheck = parseInt($("#allcheck").val())
    console.log("allcheck: "+$("#allcheck").val())
    $("#allcheck").val(allcheck+1)
    console.log("allcheck new : "+$("#allcheck").val())
}
module.exports.removecheck = function(){
    var allcheck = parseInt($("#allcheck").val())
    console.log("allcheck: "+$("#allcheck").val())
    $("#allcheck").val(allcheck-1)
    console.log("allcheck new : "+$("#allcheck").val())
}
module.exports.showOrder = function (rowsObject) {
  console.log("show order")
  $('#LKO').html('<p class="table-title font-weight-bold">LKO</p>')
  $('#TUNGGU_KAIN').html('<p class="table-title font-weight-bold">TUNGGU KAIN</p>')
  $('#POTONG').html('<p class="table-title font-weight-bold">POTONG</p>')
  $('#FILM').html('<p class="table-title font-weight-bold">FILM</p>')
  $('#SABLON').html('<p class="table-title font-weight-bold">SABLON</p>')
  $('#JAHIT').html('<p class="table-title font-weight-bold">JAHIT</p>')
  $('#PACKING').html('<p class="table-title font-weight-bold">PACKING</p>')
  $('#BELUM_KIRIM').html('<p class="table-title font-weight-bold">BELUM KIRIM</p>')
  $('#SUDAH_KIRIM').html('<p class="table-title font-weight-bold">SUDAH KIRIM</p>')
  for (let rowId in rowsObject) {
    let markup = ''
    let row = rowsObject[rowId]
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
      default: proses = '#SUDAH_KIRIM';
    }
    if(row.proses==9){
        markup += '<div class="box-process" id="box-order_'+row.id_order+'"style="background:'+row.warna+'">' +
        '<div class="namakonsumen">'+row.nama_konsumen+'</div>'+
        '<div class="font-weight-bold jenisproduk">'+row.jenis_produk+'</div>'+
        '<div class="text-jumlah">'+row.jumlah+' potong (selesai)</div>'+
        '<button type="button" class="btn btn-sm detail" id="detail_'+row.id_order+'">'+
            'Details' +
        '</button>' +
        '</div>'
    }else if(row.proses==8){
        markup += '<div class="box-process" id="box-order_'+row.id_order+'"style="background:'+row.warna+'">' +
        '<div class="namakonsumen">'+row.nama_konsumen+'</div>'+
        '<div class="font-weight-bold jenisproduk">'+row.jenis_produk+'</div>'+
        '<div class="text-jumlah">'+row.jumlah+' potong</div>'+
        '<button type="button" class="btn btn-sm detail" id="detail_'+row.id_order+'">'+
            'Details' +
        '</button>' +
        '<button type="button" class="btn btn-warning btn-sm done" id="done_'+row.id_order+'">' +
            'Done' +
        '</button>'+
        '</div>'
    }else{
        markup += '<div class="box-process" id="box-order_'+row.id_order+'"style="background:'+row.warna+'">' +
        '<div class="namakonsumen">'+row.nama_konsumen+'</div>'+
        '<div class="font-weight-bold jenisproduk">'+row.jenis_produk+'</div>'+
        '<div class="text-jumlah">'+row.jumlah+' potong</div>'+
        '<button type="button" class="btn btn-sm detail" id="detail_'+row.id_order+'">'+
            'Details' +
        '</button>' +
        '<button type="button" class="btn btn-sm next" id="next_'+row.id_order+'">' +
            'Next' +
        '</button>'+
        '</div>'
    }
    $(proses).append(markup);
  }
  $('#order-list button.detail').each(function (idx, obj) {
    $(obj).on('click', function () {
      console.log("detail id="+this.id.split('_')[1])
      window.view.showModal1(this.id.split('_')[1])
    })
  })
  $('#order-list button.next').each(function (idx, obj) {
    $(obj).on('click', function () {
      console.log("next id="+this.id.split('_')[1])
      window.view.showModal2(this.id.split('_')[1])
    })
  })
  $('#order-list button.done').each(function (idx, obj) {
    $(obj).on('click', function () {
      console.log("done id="+this.id.split('_')[1])
      window.view.showModal3(this.id.split('_')[1])
    })
  })
  
    $('button.detail').hide()
    $('button.next').hide()

    $('.box-process').hover(
    function(){
    $('#detail_'+this.id.split('_')[1]).show()
    $('#next_'+this.id.split('_')[1]).show()
    },
    function(){
    $('#detail_'+this.id.split('_')[1]).hide()
    $('#next_'+this.id.split('_')[1]).hide()
    }
    )
}

module.exports.showModal1 = function (pid) {
    //Get Order
    let rowOrder = model.getOrderbyID(pid)
    $('#isiKodeArt').text(rowOrder[0].kode_artikel)
    $('#isiNamaArt').text(rowOrder[0].nama_artikel)
    $('#isiNoLKO').text(rowOrder[0].no_lko)

    //Get Produk
    let rowProduk = model.getProdukbyID(pid)
    $('#isiJenisProduk').text(rowProduk[0].jenis_produk)
    $('#isiJenisBahan').text(rowProduk[0].jenis_bahan)
    let jenis_sablon =''
    if(rowProduk[0].jenis_sablon=='') {
        jenis_sablon ='\n'
    }else{
        jenis_sablon = rowProduk[0].jenis_sablon
    }
    $('#isiJenisSablon').text(jenis_sablon)
    $('#isiKet').text(rowProduk[0].keterangan)

    //Get Letak Sablom
    let rowLetakSablon = model.getLetakSablonbyID(rowProduk[0].id_produk)
    this.showLetakSablon(rowLetakSablon);

    //Get Warna
    let rowWarna = model.getWarnabyID(rowProduk[0].id_produk)
    this.showWarna(rowWarna);

    //Get Konsumen
    let rowKons = model.getKonsumenbyID(rowOrder[0].id_konsumen)
    $('#isiNamaKonsumen').text(rowKons[0].nama_konsumen)

    //Get Pengiriman
    let rowKirim = model.getPengirimanbyID(pid)
    this.showPengiriman(rowKirim)

    //Get Tanggal
    let date = model.getTanggal_ProsesbyID(pid)[0]
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
    $('#modalSeeDetails').modal('show')
}

module.exports.showWarna = function (rowsObject) {
    $('#isiWarnaBahan').html('')
    let markup = ''
    for (let rowId in rowsObject) {
        let row = rowsObject[rowId]
        markup += '<li>' + row.warna_bahan + '</li>'
    }
    $('#isiWarnaBahan').append(markup)
}

module.exports.showLetakSablon = function (rowsObject) {
    $('#isiLetakSablon').html('')
    let markup = ''
    for (let rowId in rowsObject) {
        let row = rowsObject[rowId]
        markup += '<li>' + row.letak_sablon + '</li>'
    }
    $('#isiLetakSablon').append(markup)
}

module.exports.showPengiriman = function (rowsObject) {
    $('#isiKirim').html('')
    let markup =''
    for (let rowId in rowsObject) {
        let rowPengiriman = rowsObject[rowId]
        let urutan = rowPengiriman.urutan
            markup += '<div class="row"> <div class="col-6 font-weight-bold namaInfo" style="margin-top:10px;">  Pengiriman-'+ urutan + '</div></div> <div class="row"> <div class="col-4"> ' +
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
    }
    $('#isiKirim').append(markup)
}
module.exports.showModal2 = function (id) {
  $('#modalNext button.btn-primary').attr('id','save-next_'+id)
  $('#modalNext').modal('show')
}
module.exports.showModal3 = function (id) {
    $('#modalDone button.btn-primary').attr('id','set-done_'+id)
    $('#modalDone').modal('show')
  }