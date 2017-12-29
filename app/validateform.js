// Example starter JavaScript for disabling form submissions if there are invalid fields
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
            alert ("Format Kode Artikel salah. Ikutin contoh format berikut ini'CM-111217-IBUSUSI001'")
        }
    }

    //Check Nomer LKO


}

$(document).ready(function(){
    $('form input[id="input2"]').prop("disabled", true);
    $("#check2").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="input2"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="input2"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="input4"]').prop("disabled", true);
    $("#check4").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="input4"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="input4"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="input6"]').prop("disabled", true);
    $("#check6").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="input6"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="input6"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="input8"]').prop("disabled", true);
    $("#check8").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="input8"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="input8"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="input10"]').prop("disabled", true);
    $("#check10").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="input10"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="input10"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="input12"]').prop("disabled", true);
    $("#check12").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="input12"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="input12"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="inputXS"]').prop("disabled", true);
    $("#checkXS").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="inputXS"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="inputXS"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="inputS"]').prop("disabled", true);
    $("#checkS").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="inputS"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="inputS"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="inputM"]').prop("disabled", true);
    $("#checkM").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="inputM"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="inputM"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="inputL"]').prop("disabled", true);
    $("#checkL").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="inputL"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="inputL"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="inputXL"]').prop("disabled", true);
    $("#checkXL").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="inputXL"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="inputXL"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="input3L"]').prop("disabled", true);
    $("#check3L").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="input3L"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="input3L"]').prop("disabled", true);
        }
    });
});

$(document).ready(function(){
    $('form input[id="input4L"]').prop("disabled", true);
    $("#check4L").click(function(){
        if($(this).prop("checked") == true){
            $('form input[id="input4L"]').prop("disabled", false);
        }
        else if($(this).prop("checked") == false){
            $('form input[id="input4L"]').prop("disabled", true);
        }
    });
});
