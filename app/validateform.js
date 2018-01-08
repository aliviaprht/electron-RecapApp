$(document).ready(function(){
    let allkode = window.model.getAllKodeArtikel()
    $('#inputKodeArt').keyup(function(){
        let value = $.trim(this.value)
        if(value!=''){
            let kodeart_state = true
            for(let i in allkode){
                let kode = allkode[i]
                if(kode.kode_artikel==value){
                    kodeart_state = false;
                }
            }
            console.log('kode artikel :'+kodeart_state)
            sendValidation('inputKodeArt','Kode Artikel has been used',kodeart_state)
        }else{
            sendValidation('inputKodeArt','Please insert '+$('#'+this.id+'_label').html(),false)
        }
    });
    let allLKO = window.model.getAllNoLKO()
    $('#inputNoLKO').keyup(function(){
        let value = $.trim(this.value)
        if(value!=''){
            let LKO_state = true
            for(let i in allLKO){
                let LKO = allLKO[i]
                if(LKO.no_lko==value){
                    LKO_state = false;
                }
            }
            console.log('lko :'+LKO_state)
            sendValidation('inputNoLKO','Nomor LKO has been used',LKO_state)
        }else{
            sendValidation('inputNoLKO','Please insert '+$('#'+this.id+'_label').html(),false)
        }
    });
    let allKonsumen = window.model.getAllKonsumen()
    $('#inputNamaKonsumen').keyup(function(){
        let value = $.trim(this.value)
        if(value!=''){
            let exist = false
            for(let i in allKonsumen){
                let konsumen = allKonsumen[i]
                if(konsumen.nama_konsumen==value){
                    exist = true;
                }
            }
            console.log('nama konsumen exist:'+exist)
            let message = ''
            if(exist){
                message ='Name given has ordered before'
            }else{
                message ='Name given never ordered before'
            }
            sendValidation('inputNamaKonsumen',true,true)
            $('#message_inputNamaKonsumen').html(message)
        }else{
            $('#message_inputNamaKonsumen').html('')
            sendValidation('inputNamaKonsumen','Please insert '+$('#'+this.id+'_label').html(),false)
        }
    });
    $('#inputNamaArt').keyup(function(){
        let value = $.trim(this.value)
        if(value!=''){
            console.log('nama artikel not null')
            sendValidation('inputNamaArt',true,true)
        }else{
            sendValidation('inputNamaArt','Please insert '+$('#'+this.id+'_label').html(),false)
        }
    });
    $('#inputJenisProduct').keyup(function(){
        let value = $.trim(this.value)
        if(value!=''){
            console.log('jenisproduct not null')
            sendValidation('inputJenisProduct',true,true)
        }else{
            sendValidation('inputJenisProduct','Please insert '+$('#'+this.id+'_label').html(),false)
        }
    });
    $('#inputJenisBahan').click(function(){
        let value = $('#inputJenisBahan option:selected').val()
        if(value!=''){
            console.log('jenis bahan not null')
            sendValidation('inputJenisBahan',true,true)
        }else{
            sendValidation('inputJenisBahan','Please insert '+$('#'+this.id+'_label').html(),false)
        }
    });
    $('#inputJenisSablon').click(function(){
        let value = $('#inputJenisSablon option:selected').val()
        if(value!=''){
            console.log('jenis sablon not null')
            sendValidation('inputJenisSablon',true,true)
            removeValidationAttr('inputLetakSablon')
            $.each($("input[name='letaksablon']"), function(){            
                $(this).prop('disabled',false)
            }); 
        }else{
            $.each($("input[name='letaksablon']"), function(){            
                $(this).prop('disabled',true)
                $(this).prop('checked',false)
            }); 
        }
    });
    $("input[name='letaksablon']").on('click',function(){            
        if(this.checked){
            removeValidationAttr('inputLetakSablon')
        }else{
            let checked = false
            $.each($("input[name='letaksablon']:checked"), function(){   
                checked = true         
            }); 
            if(!checked){
                sendValidation('inputLetakSablon','Please choose Letak Sablon',false)
            }
        }
    });
 
})
function checkwarna(id){
    console.log(id)            
    let value1 = $('#'+id+' option:selected').val()
    console.log(value1)
    let value2 = $('#inputOtherWarna_'+id.split('_')[1]).val()
    console.log(value2)
    if(value1=='' && value2 ==""){
        sendValidation(id,'Please choose Warna Bahan or input Warna Lain '+id.split('_')[1],false)
        sendValidation('inputOtherWarna_'+id.split('_')[1],false,false)
    }else{
        console.log(id+' not null')
        sendValidation(id,true,true)
        sendValidation('inputOtherWarna_'+id.split('_')[1],true,true)
        $('#inputOtherWarna_'+id.split('_')[1]).val('')
    }
}
function checkotherwarna(id){           
    let ID = id.split('_')[1]
    if($('#'+id).val()==''){
        if($('#inputWarnaBahan_'+ID).val()==''){
            sendValidation('inputOtherWarna_'+ID,false,false)
            sendValidation('inputWarnaBahan_'+ID,'Please choose Warna Bahan or input Warna Lain '+ID,false)
        }
    }else{
        sendValidation('inputWarnaBahan_'+ID,true,true)
        sendValidation('inputOtherWarna_'+ID,true,true)
        $('#inputWarnaBahan_'+ID).prop('selectedIndex',0);
    }
}
function checkukuran(id){
    let value = $.trim($('#'+id).val())
    let regex =/^[0-9]*$/
    removeValidationAttr('form-pengiriman')
    if(value==''){
        removeValidationAttr(id)
    }else{
        if(regex.test(value)){
            sendValidation(id,'',true)
        }else{
            sendValidation(id,'',false)
            $('#error_form-pengiriman').html('Please input number only')
        }
    }
}
function removeValidationAttr(idInput){
    $('#'+idInput).removeClass('has-error')
    $('#'+idInput+'_label').removeClass('has-error')
    $('#'+idInput).removeClass('has-success')
    $('#'+idInput+'_label').removeClass('has-success')
    $('#error_'+idInput).html('')
    $('#success_'+idInput).html('')
    $('#messsage_'+idInput).html('')
}
function sendValidation(idInput,message,state){
    if(state){
        removeValidationAttr(idInput)
        $('#'+idInput).addClass('has-success')
        $('#'+idInput+'_label').addClass('has-success')
        $('#error_'+idInput).html('')
        $('#success_'+idInput).html(message)
    }else{
        removeValidationAttr(idInput)
        $('#'+idInput).addClass('has-error')
        $('#'+idInput+'_label').addClass('has-error')
        $('#error_'+idInput).html(message)
    }

}
function checkValidity(){
    let valid=true
    $.each($("input:required"), function(){            
        if(this.value==''){
            valid = false
            sendValidation(this.id,'Please insert '+$('#'+this.id+'_label').html(),false)
        }
    });
    $.each($("select:required"), function(){            
        if(this.value==''){
            valid = false
            sendValidation(this.id,'Please insert '+$('#'+this.id+'_label').html(),false)
        }
    });
    let checked = false
    if($('#inputJenisSablon').val()!=''){
        $.each($("input[name='letaksablon']:checked"), function(){   
            checked = true         
        }); 
        if(!checked){
            sendValidation('inputLetakSablon','Please choose Letak Sablon',false)
        }
    }else{
        checked=true
    }
    let ukuraninserted=false;
    $.each($("input.inputUkuran"), function(){            
        if(this.value!=''){
            ukuraninserted=true;
        }
    });
    if(!ukuraninserted){
        sendValidation('form-pengiriman','Please insert ukuran',false)
    }
    let no_error = true
    $.each($(".has-error"), function(){            
        no_error = false
    });
    if(!no_error){
        console.log('there still error')
    }
    return (valid&&checked&&ukuraninserted&&no_error)
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

