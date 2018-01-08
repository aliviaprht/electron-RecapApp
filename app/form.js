'use strict'
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
                "<input type='text' class='form-control-sm inputUkuran' onkeyup='return checkukuran(this.id)' id='input2_"+jumlah_pengiriman_baru +"' input>" +
                "</div>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran 4 </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' onkeyup='return checkukuran(this.id)' id='input4_"+jumlah_pengiriman_baru+"' input>" +
                "</div>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran 6 </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' onkeyup='return checkukuran(this.id)' id='input6_"+jumlah_pengiriman_baru+"' input>" +
                '</div>' +
                '<div class="form-size">' +
                    '<div class="tag-ukuran"> Ukuran 8 </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" onkeyup="return checkukuran(this.id)" id="input8_'+jumlah_pengiriman_baru+'" input>' +
                '</div>' +
                '<div class="form-size">' +
                    '<div class="tag-ukuran"> Ukuran 10 </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" onkeyup="return checkukuran(this.id)" id="input10_'+jumlah_pengiriman_baru+'" input>' +
                '</div>' +
                '<div class="form-size">'+
                    '<div class="tag-ukuran"> Ukuran 12 </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" onkeyup="return checkukuran(this.id)" id="input12_'+jumlah_pengiriman_baru+'" input>' +
                "</div>" +
                "</div>" ;
    var col2 =  "<div class='col-size'>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran XS </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' onkeyup='return checkukuran(this.id)' id='inputXS_"+jumlah_pengiriman_baru +"' input>" +
                "</div>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran S </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' onkeyup='return checkukuran(this.id)' id='inputS_"+jumlah_pengiriman_baru+"' input>" +
                "</div>" +
                "<div class='form-size'>" +
                "<div class='tag-ukuran'> Ukuran M </div>" +
                " : " +
                "<input type='text' class='form-control-sm inputUkuran' onkeyup='return checkukuran(this.id)' id='inputM_"+jumlah_pengiriman_baru+"' input>" +
                '</div>' +
                '<div class="form-size">' +
                    '<div class="tag-ukuran"> Ukuran L </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" onkeyup="return checkukuran(this.id)" id="inputL_'+jumlah_pengiriman_baru+'" input>' +
                '</div>' +
                '<div class="form-size">' +
                    '<div class="tag-ukuran"> Ukuran XL </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" onkeyup="return checkukuran(this.id)" id="inputXL_'+jumlah_pengiriman_baru+'" input>' +
                '</div>' +
                '<div class="form-size">'+
                    '<div class="tag-ukuran"> Ukuran 3L </div>' +
                    ' : ' +
                    '<input type="text" class="form-control-sm inputUkuran" onkeyup="return checkukuran(this.id)" id="input3L_'+jumlah_pengiriman_baru+'" input>' +
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

$('#tambah_warna').click(function(){
    console.log('tambah warna')
    var jumlah_warna = parseInt($('#jumlah_warna').val())
    var jumlah_warna_baru = jumlah_warna+1
    console.log(jumlah_warna_baru)
    $('#jumlah_warna').val(jumlah_warna_baru)
    $('#hapus_warna_'+jumlah_warna).hide()
    var opsi = '<div class="row" id="warna_bahan_'+jumlah_warna_baru+'">' +
                '<label class="col-3" id="inputWarnaBahan_'+jumlah_warna_baru+'_label">Warna Bahan '+jumlah_warna_baru+' </label>'+
                '<select type="text" class="form-control col-3" id="inputWarnaBahan_'+jumlah_warna_baru+'" name="inputWarnaBahan" onclick="return checkwarna(this.id)">"'+
                '<option value="" selected>Choose...</option>' +
                '<option value="Abu MD1">Abu MD1</option>' +
                '<option value="Abu MD2">Abu MD2</option>' +
                '<option value="Abu SDG">Abu SDG</option>' +
                '<option value="Abu Tua">Abu Tua</option>' +
                '<option value="Anggur">Anggur</option>'+
                '<option value="Army">Army</option>'+
                '<option value="Beby">Beby</option>'+
                '<option value="Benhur T">Benhur T</option>'+
                '<option value="Burgundi">Burgundi</option>'+
                '<option value="B. Langit">B. Langit</option>'+
                '<option value="B. SMA">B. SMA</option>'+
                '<option value="C. Bata">C. Bata</option>'+
                '<option value="C. Kakt">C. Kakt</option>'+
                '<option value="C. Kopi">C. Kopi</option>'+
                '<option value="C. Pramuka">C. Pramuka</option>'+
                '<option value="C. Telur">C. Telur</option>'+
                '<option value="Hitam">Hitam</option>'+
                '<option value="H. Botol">H. Botol</option>'+
                '<option value="H. Denim">H. Denim</option>'+
                '<option value="KNari">KNari</option>'+
                '<option value="K. Busuk">K. Busuk</option>'+
                '<option value="K. Mas">K. Mas</option>'+
                '<option value="Lumut">Lumut</option>'+
                '<option value="Magenta">Magenta</option>'+
                '<option value="Marun">Marun</option>'+
                '<option value="Mentari">Mentari</option>'+
                '<option value="Merah">Merah</option>'+
                '<option value="M. Denim">M. Denim</option>'+
                '<option value="M. Neut">M. Neut</option>'+
                '<option value="M. 71">M. 71</option>'+
                '<option value="M. 81">M. 81</option>'+
                '<option value="M. 85">M. 85</option>'+
                '<option value="Neut">Neut</option>'+
                '<option value="Oren Bata">Oren Bata</option>'+
                '<option value="Oren Cerah">Oren Cerah</option>'+
                '<option value="Pandan">Pandan</option>'+
                '<option value="Pink">Pink</option>'+
                '<option value="Puji">Puji</option>'+
                '<option value="Putih">Putih</option>'+
                '<option value="Putih BW">Putih BW</option>'+
                '<option value="Salm">Salm</option>'+
                '<option value="Stabilo">Stabilo</option>'+
                '<option value="Stabilo MD">Stabilo MD</option>'+
                '<option value="TNI">TNI</option>'+
                '<option value="Tosca">Tosca</option>'+
                '<option value="Tosca MD">Tosca MD</option>'+
                '<option value="Trong">Trong</option>'+
                '<option value="Turqis">Turqis</option>'+
                '<option value="Turqis MD">Turqis MD</option>'+
                '<option value="Turqis T.">Turqis T.</option>'+
                '<option value="Ungu Muda">Ungu Muda</option>'+
                '<option value="Ungu Tua">Ungu Tua</option>'+
                '<option value="Ungu Tua SPC">Ungu Tua SPC</option>'+
                '</select>'+
                '<label class="col-2" id="inputOtherWarna_'+jumlah_warna_baru+'_label">Warna Lain :</label>'+
                '<input class="form-control col-3 otherwarna" type="text" id="inputOtherWarna_'+jumlah_warna_baru+'" name="otherwarna" onkeyup="return checkotherwarna(this.id)">'+
                "<a class='btn btn-danger hapus' id='hapus_warna_"+jumlah_warna_baru+"' onclick='hapus_warna(this.id)'>hapus</a>"+
                "<div class='error-message col-3' id='error_inputWarnaBahan_"+jumlah_warna_baru+"'>"+
                "</div>"+
                "</div>"
        $('#warna').append(opsi)
});
