'use strict'

const fs = require('fs')
const path = require('path')
const app = require('electron').remote.app
const cheerio = require('cheerio')
const {ipcRenderer} = require('electron')

window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

let webRoot = path.dirname(__dirname)
window.view = require(path.join(webRoot, 'view.js'))
window.model = require(path.join(webRoot, 'model.js'))
window.model.db = path.join(app.getPath('userData'), 'order.db')
window.form = require(path.join(webRoot, 'detail.js'))

// Example starter JavaScript for disabling form submissions if there are invalid fields
function getRandomColor() {
    var allcolor = model.getAllKonsumen()
    var letters = '0123456789ABCDEF';
    var got = false;
    var color = '#'
    while(!got){
        color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        var exist=false;
        if(allcolor!=null){
            for(let col in allcolor){
                if(color==allcolor[col].warna){
                    exist = true;
                }
            }
        }
        if(!exist){
            got=true;
        }
    }
    return color
  }

function submitForm(){
    if((checkValidity())){
        var kodeart = $.trim($('#inputKodeArt').val())
        var LKO = $.trim($('#inputNoLKO').val())
        var namaart = $.trim($('#inputNamaArt').val())
        var produk = $.trim($('#inputJenisProduct').val())
        var konsumen = $.trim($('#inputNamaKonsumen').val())
        var bahan = $('#inputJenisBahan option:selected').val()
        var sablon = $('#inputJenisSablon option:selected').val()
        var letaksablon = [];
            $.each($("input[name='letaksablon']:checked"), function(){            
                letaksablon.push($(this).val());
            }); 
        var jumlah_warna = $('#jumlah_warna').val()
        var warna = [];
            for(var i=1;i<=jumlah_warna;i++){
                warna.push($('#inputWarnaBahan_'+i+' option:selected').val())
            }
        var keterangan = $('#inputKeterangan').val()
        var jumlah_pengiriman = parseInt($('#jumlah_pengiriman').val())
        var pengiriman = getPengiriman()
        console.log(kodeart,LKO,namaart,produk,konsumen,bahan,sablon,letaksablon,warna,keterangan,jumlah_pengiriman,pengiriman)
        // save to database
        var id_konsumen = saveKonsumen(konsumen)
        var jumlah = getJumlahTotal(pengiriman,jumlah_pengiriman)
        //save order to database
        var id_order = saveOrder(kodeart,namaart,LKO,id_konsumen,jumlah)
        var id_produk = saveProduk(id_order,produk,bahan,sablon,keterangan)
        saveLetakSablon(id_produk,letaksablon)
        saveWarna(id_produk,warna)
        savePengiriman(id_order,pengiriman)
        saveTanggalProses(id_order)
        saveLog(id_order)
        window.view.showModal3(id_order)
        $('#success-submit').modal('show');
        setTimeout(function() {
            $('#success-submit').modal('hide');
            ipcRenderer.send('close-form-submit')
        }, 2000);
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
function saveLog(id_order){
    var today = new Date()
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    model.saveFormData("log",{columns:['id_order','tanggal','proses'],values:[id_order,date,0]})
}
function saveTanggalProses(id_order){
    var today = new Date()
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    model.saveFormData("tanggal_proses",{columns:['id_order','LKO'],values:[id_order,date]})
}
function savePengiriman(id_order,pengiriman){
    for(let idx in pengiriman){
        var keyValue= {columns:['id_order','urutan','status_pengiriman','size_2','size_4','size_6','size_8','size_10','size_12','size_XS','size_S','size_M','size_L','size_XL','size_3L','size_4L'],values:[]}
        keyValue.values.push(id_order)
        keyValue.values.push(parseInt(idx)+1)
        keyValue.values.push(0)
        for(let size in pengiriman[idx]){
            keyValue.values.push(pengiriman[idx][size])
        }
        model.saveFormData("pengiriman",keyValue)
    }
}
function saveWarna(id_produk,warna){
    for(let idx in warna){
        console.log(warna[idx])
        model.saveFormData("warna",{columns:['id_produk','warna_bahan'],values:[id_produk,warna[idx]]})
    }
}
function saveLetakSablon(id_produk,letaksablon){
    for(let idx in letaksablon){
        model.saveFormData("letak_sablon",{columns:['id_produk','letak_sablon'],values:[id_produk,letaksablon[idx]]})
    }
}
function saveProduk(id_order,produk,bahan,sablon,keterangan){
    model.saveFormData("produk",{columns:['id_order','jenis_produk','jenis_bahan','jenis_sablon','keterangan'],values:[id_order,produk,bahan,sablon,keterangan]})
    var result = model.getProdukbyID(id_order)[0].id_produk
    console.log("added id_produk :"+result)
    return result
}
function saveOrder(kodeart,namaart,LKO,id_konsumen,jumlah){
    if(model.getOrderbyArticle(kodeart)==null){
        model.saveFormData("order",{columns:['kode_artikel','nama_artikel','no_lko','id_konsumen','jumlah','proses'],values:[kodeart,namaart,LKO,id_konsumen,jumlah,0]})
    }
    var result = model.getOrderbyArticle(kodeart)[0].id_order
    console.log("added id_order:" +result)
    return result
}
function getJumlahTotal(pengiriman,jumlah_pengiriman){
    let jumlah = 0;
    for(let i =0;i<jumlah_pengiriman;i++){
        for(let j=0;j<13;j++){
            jumlah += pengiriman[i][j]
        }
    }
    return jumlah
}
function saveKonsumen(nama){
    if(model.getKonsumenbyName(nama)==null){
        var color = getRandomColor()
        console.log(color)
        model.saveFormData("konsumen",{columns:['nama_konsumen','warna'],values:[nama,color]})
    }
    var result = model.getKonsumenbyName(nama)[0].id_konsumen
    console.log("added id_konsumen :"+result)
    return result
}
function getPengiriman(){
    var pengiriman = []
    var value;
    var det_pengiriman = []
    var jumlah_pengiriman = parseInt($('#jumlah_pengiriman').val())
        for(let i=1;i<=jumlah_pengiriman;i++){
            let allnil = true
            det_pengiriman =[]
            value = 0;
            if($('#input2_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#input2_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input4_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#input4_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input6_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#input6_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input8_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#input8_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input10_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#input10_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input12_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#input12_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputXS_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#inputXS_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputS_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#inputS_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputM_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#inputM_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputL_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#inputL_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputXL_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#inputXL_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input3L_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#input3L_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input4L_'+i).val()!=""){
                allnil=false;
                value = parseInt($('#input4L_'+i).val())
            }
            det_pengiriman.push(value)
            if(!allnil){
                pengiriman.push(det_pengiriman)
            }else{
                console.log('allnil idx:'+i)
            }
        }
    return pengiriman
}

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

$('#close-submit').click(function(){
    ipcRenderer.send('close-form-submit')
})
