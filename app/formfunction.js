'use strict'
window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')
function hapus(id){
    console.log("hapus "+id)
    var jumlah_pengiriman = $('#jumlah_pengiriman').val()
    var jumlah_pengiriman_baru = parseInt(jumlah_pengiriman)-1
    $('#jumlah_pengiriman').val(jumlah_pengiriman_baru)
    $('#pengiriman_'+jumlah_pengiriman).remove()
    $('#hapus_pengiriman_'+jumlah_pengiriman_baru).show()
}
function hapus_warna(id){
    console.log("hapus warna "+id)
    var jumlah_warna = $('#jumlah_warna').val()
    console.log(jumlah_warna)
    var jumlah_warna_baru = parseInt(jumlah_warna)-1
    $('#jumlah_warna').val(jumlah_warna_baru)
    $('#warna_bahan_'+jumlah_warna).remove()
    $('#hapus_warna_'+jumlah_warna_baru).show()
}