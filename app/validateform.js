// Example starter JavaScript for disabling form submissions if there are invalid fields
function getRandomColor() {
    var allcolor = model.getAllKonsumenColor()
    var letters = '123456789ABCDEF';
    var got = false;
    var color = '#'
    while(!got){
        color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 15)];
        }
        var exist=false;
        if(allcolor!=null){
            for(col in allcolor.values){
                if(color==col){
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
    var form = document.getElementById('orderForm');
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        console.log("not valid")
    }
    form.classList.add('was-validated');
    if((form.checkValidity())){
        var kodeart = $('#inputKodeArt').val()
        var LKO = $('#inputNoLKO').val()
        var namaart = $('#inputNamaArt').val()
        var produk = $('#inputJenisProduct').val()
        var konsumen = $('#inputNamaKonsumen').val()
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
function saveTanggalProses(id_order){
    var today = new Date()
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    model.saveFormData("tanggal_proses",{columns:['id_order','LKO'],values:[id_order,date]})
}
function savePengiriman(id_order,pengiriman){
    for(idx in pengiriman){
        var keyValue= {columns:['id_order','urutan','status_pengiriman','size_2','size_4','size_6','size_8','size_10','size_12','size_XS','size_S','size_M','size_L','size_XL','size_3L','size_4L'],values:[]}
        keyValue.values.push(id_order)
        keyValue.values.push(parseInt(idx)+1)
        keyValue.values.push(0)
        for(size in pengiriman[idx]){
            keyValue.values.push(pengiriman[idx][size])
        }
        model.saveFormData("pengiriman",keyValue)
    }
}
function saveWarna(id_produk,warna){
    for(idx in warna){
        console.log(warna[idx])
        model.saveFormData("warna",{columns:['id_produk','warna_bahan'],values:[id_produk,warna[idx]]})
    }
}
function saveLetakSablon(id_produk,letaksablon){
    for(idx in letaksablon){
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
    var jumlah = 0;
    for(var i =0;i<jumlah_pengiriman;i++){
        for(var j=0;j<12;j++){
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

