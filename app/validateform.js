// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';

    window.addEventListener('load', function() {
        var form = document.getElementById('orderForm');
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    }, false);
})();

function checkAllInput() {
    var kodeart = document.orderForm.inputKodeArt;
    var noLKO = document.orderForm.inputNoLKO;
    var namaArtikel = document.orderForm.inputNamaArt;
    var namaKonsumen = document.orderForm.inputNamaKonsumen;
    var jenisProduct = document.orderForm.inputJenisProduct;

    //Check Kode Artikel
    if(kodeart.value != "") {
        var regex = /^(\w{2}-\d{6}-\w+)$/;
        if (regex.test(kodeart.value) === false) {
            alert ("Format Kode Artikel salah. Ikutin contoh format berikut ini 'CM-111217-IBUSUSI001'")
        }
    }

    //Check Nomer LKO
    if (noLKO.value != "") {
        var regex = /^(\w{2}-\d{5}-\w+)$/;
        if (regex.test(noLKO.value) === false) {
            alert ("Format No.LKO salah. Ikuti contoh format berikut ini 'KP-14874-XVII'")
        }
    }

    //Check Nama Artikel
    if (namaArtikel.value != "") {
        var regex = /^[a-zA-Z0-9\s]+$/;
        if (regex.test(namaArtikel.value) === false) {
            alert ("Nama Artikel tidak valid")
        }
    }

    //Check Nama Konsumen
    if (namaKonsumen.value != "") {
        var regex = /^[a-zA-Z0-9\s]+$/;
        if (regex.test(namaKonsumen.value) === false) {
            alert ("Nama Konsumen tidak valid")
        }
    }

    //Check Jenis Product
    if (jenisProduct.value != "") {
        var regex = /^[a-zA-Z\s]+$/;
        if (regex.test(jenisProduct.value) === false) {
            alert ("Jenis Produk tidak valid")
        }
    }


}

