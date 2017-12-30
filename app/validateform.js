// Example starter JavaScript for disabling form submissions if there are invalid fields
const path = require('path')
const model = require(path.join(__dirname, '../model.js'))
function getRandomColor() {
    var allcolor = model.getAllKonsumenColor()
    var letters = '0123456789ABCDEF';
    var got = false;
    var color = '#'
    while(!got){
        color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        var exist=false;
        for(col in allcolor.values){
            if(color==col){
                exist = true;
            }
        }
        if(!exist){
            got=true;
        }
    }
    return color
  }
function submitForm(){
    var form = document.getElementById('orderForm');
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        console.log("not valid")
    }
    form.classList.add('was-validated');
    if(checkAllInput()&&(form.checkValidity())){
        var kodeart = $('#inputKodeArt').val()
        var LKO = $('#inputNoLKO').val()
        var namaart = $('#inputNamaArt').val()
        var product = $('#inputJenisProduct').val()
        var konsumen = $('#inputNamaKonsumen').val()
        var bahan = $('#inputJenisBahan option:selected').val()
        var sablon = $('#inputJenisSablon option:selected').val()
        var letaksablon = [];
            $.each($("input[name='letaksablon']:checked"), function(){            
                letaksablon.push($(this).val());
            }); 
        var keterangan = $('#inputKeterangan').val()
        var jumlah_pengiriman = parseInt($('#jumlah_pengiriman').val())
        var pengiriman = getPengiriman()
        console.log(kodeart,LKO,namaart,product,konsumen,bahan,sablon,letaksablon,keterangan,jumlah_pengiriman,pengiriman)
        // save to database
        if(model.getKonsumenIDbyName(konsumen)==null){
            var color = getRandomColor()
            console.log(color)
            model.saveFormData("konsumen,{columns:['nama_konsumen','warna'],values:['"+konsumen+"',"+color+"]})")
        }
    }
}
function getPengiriman(){
    var pengiriman = []
    var value;
    var det_pengiriman = []
    var jumlah_pengiriman = parseInt($('#jumlah_pengiriman').val())
        for(var i=1;i<=jumlah_pengiriman;i++){
            det_pengiriman =[]
            value = 0;
            if($('#input2_'+i).val()!=""){
                value = parseInt($('#input2_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input4_'+i).val()!=""){
                value = parseInt($('#input4_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input6_'+i).val()!=""){
                value = parseInt($('#input6_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input8_'+i).val()!=""){
                value = parseInt($('#input8_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input10_'+i).val()!=""){
                value = parseInt($('#input10_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input12_'+i).val()!=""){
                value = parseInt($('#input12_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputXS_'+i).val()!=""){
                value = parseInt($('#inputXS_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputS_'+i).val()!=""){
                value = parseInt($('#inputS_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputM_'+i).val()!=""){
                value = parseInt($('#inputM_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputL_'+i).val()!=""){
                value = parseInt($('#inputL_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#inputXL_'+i).val()!=""){
                value = parseInt($('#inputXL_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input3L_'+i).val()!=""){
                value = parseInt($('#input3L_'+i).val())
            }
            det_pengiriman.push(value)
            value = 0;
            if($('#input4L_'+i).val()!=""){
                value = parseInt($('#input4L_'+i).val())
            }
            det_pengiriman.push(value)
            pengiriman.push(det_pengiriman)
        }
    return pengiriman
}
function checkAllInput() {
    var kodeart = document.orderForm.inputKodeArt;
    var noLKO = document.orderForm.inputNoLKO;
    var namaArtikel = document.orderForm.inputNamaArt;
    var namaKonsumen = document.orderForm.inputNamaKonsumen;
    var jenisProduct = document.orderForm.inputJenisProduct;
    var checkkodeart = true;
    var checklko = true;
    var checkartikel = true;
    var checkkonsumen = true;
    var checkproduct = true;
    //Check Kode Artikel
    if(kodeart.value != "") {
        var regex = /^(\w{2}-\d{6}-\w+)$/;
        if (regex.test(kodeart.value) === false) {
            alert ("Format Kode Artikel salah. Ikutin contoh format berikut ini 'CM-111217-IBUSUSI001'")
            checkkodeart = false
        }
    }

    //Check Nomer LKO
    if (noLKO.value != "") {
        var regex = /^(\w{2}-\d{5}-\w+)$/;
        if (regex.test(noLKO.value) === false) {
            alert ("Format No.LKO salah. Ikuti contoh format berikut ini 'KP-14874-XVII'")
            checklko=false
        }
    }

    //Check Nama Artikel
    if (namaArtikel.value != "") {
        var regex = /^[a-zA-Z0-9\s]+$/;
        if (regex.test(namaArtikel.value) === false) {
            alert ("Nama Artikel tidak valid")
            checkartikel = false
        }
    }

    //Check Nama Konsumen
    if (namaKonsumen.value != "") {
        var regex = /^[a-zA-Z0-9\s]+$/;
        if (regex.test(namaKonsumen.value) === false) {
            alert ("Nama Konsumen tidak valid")
            checkkonsumen = false
        }
    }

    //Check Jenis Product
    if (jenisProduct.value != "") {
        var regex = /^[a-zA-Z\s]+$/;
        if (regex.test(jenisProduct.value) === false) {
            alert ("Jenis Produk tidak valid")
            checkproduct=false
        }
    }
    return (checkartikel&&checkkodeart&&checkkonsumen&&checklko&&checkproduct)

}