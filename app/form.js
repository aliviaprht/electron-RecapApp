'use strict'
const path = require('path')
const model = require(path.join(__dirname, 'model.js'))
const {ipcRenderer} = require('electron')
window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')
//submit form
    //validate no.LKO

    //add data to db
$('document').ready(function () {
    console.log("form.js")
})
$('#cancel-form').click( function () {
    console.log("close-form")
    ipcRenderer.send('close-form')
});
$('#save-form').click( function () {
    console.log("save-form")
    //validate

    var kodear = $('inputKodeArt').val;

});
$('#tambah_pengiriman').click(function(){
    console.log("tambah_pengiriman")
    var jumlah_pengiriman = $('#jumlah_pengiriman').val()
    $('#hapus_pengiriman_'+jumlah_pengiriman).hide()
    console.log("jumlah_pengiriman lama= "+jumlah_pengiriman)
    var jumlah_pengiriman_baru = parseInt(jumlah_pengiriman)+1
    $('#jumlah_pengiriman').val(jumlah_pengiriman_baru)
    console.log("jumlah_pengiriman baru= "+$('#jumlah_pengiriman').val())
    var outer = "<div class='row' id='pengiriman_"+jumlah_pengiriman_baru+"'></p>"
    console.log(outer)
    var title = "<div class='col-size'>" + 
                "<h6 class='pengiriman-title'>Pengiriman "+jumlah_pengiriman_baru+"</h6>" +
                "<a class='btn btn-danger my-2 my-sm-0 hapus' id='hapus_pengiriman_"+jumlah_pengiriman_baru+"' onclick='hapus(this.id)'>hapus</a>"+
                "</div>";
    console.log(title)
    var col1 =  "<div class='col-size'>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran 2 </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' id='input2_"+jumlah_pengiriman_baru +"' input>" +
                "</div>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran 4 </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' id='input4_"+jumlah_pengiriman_baru+"' input>" +
                "</div>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran 6 </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' id='input6_"+jumlah_pengiriman_baru+"' input>" +
                '</div>' +
                '<div class="form-size">' +
                    '<div class="tag-ukuran"> Ukuran 8 </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" id="input8_'+jumlah_pengiriman_baru+'" input>' +
                '</div>' +
                '<div class="form-size">' +
                    '<div class="tag-ukuran"> Ukuran 10 </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" id="input10_'+jumlah_pengiriman_baru+'" input>' +
                '</div>' +
                '<div class="form-size">'+
                    '<div class="tag-ukuran"> Ukuran 12 </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" id="input12_'+jumlah_pengiriman_baru+'" input>' +
                "</div>" +
                "</div>" ;
    var col2 =  "<div class='col-size'>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran XS </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' id='inputXS_"+jumlah_pengiriman_baru +"' input>" +
                "</div>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran S </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' id='inputS_"+jumlah_pengiriman_baru+"' input>" +
                "</div>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran M </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' id='inputM_"+jumlah_pengiriman_baru+"' input>" +
                '</div>' +
                '<div class="form-size">' +
                    '<div class="tag-ukuran"> Ukuran L </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" id="inputL_'+jumlah_pengiriman_baru+'" input>' +
                '</div>' +
                '<div class="form-size">' +
                    '<div class="tag-ukuran"> Ukuran XL </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" id="inputXL_'+jumlah_pengiriman_baru+'" input>' +
                '</div>' +
                '<div class="form-size">'+
                    '<div class="tag-ukuran"> Ukuran 3L </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" id="input3L_'+jumlah_pengiriman_baru+'" input>' +
                "</div>" +
                "</div>" ;
    var col3 =  "<div class='col-size'>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran 4L </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' id='input4L_"+jumlah_pengiriman_baru +"' input>" +
                "</div>" +
                "</div>";
    
    $('#form-pengiriman').append(outer)
    $('#pengiriman_'+jumlah_pengiriman_baru).append(title,col1,col2,col3)
});

function hapus(id){
    console.log("hapus "+id)
    var jumlah_pengiriman = $('#jumlah_pengiriman').val()
    var jumlah_pengiriman_baru = parseInt(jumlah_pengiriman)-1
    $('#jumlah_pengiriman').val(jumlah_pengiriman_baru)
    $('#pengiriman_'+jumlah_pengiriman).remove()
    $('#hapus_pengiriman_'+jumlah_pengiriman_baru).show()
}