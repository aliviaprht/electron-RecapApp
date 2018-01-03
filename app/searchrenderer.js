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


// Compose the DOM from separate HTML concerns; each from its own file.
let htmlPath = path.join(app.getAppPath(), 'app', 'html')
let order = fs.readFileSync(path.join(htmlPath, 'order.html'), 'utf8')
let modal = fs.readFileSync(path.join(htmlPath, 'modal.html'), 'utf8')
// Pass the DOM from Cheerio to jQuery.
console.log("document inserted")

$('document').ready(function () {
    console.log("searchrenderer.js")
})

$('#exit-search').click( function () {
    console.log("exit-search")
    ipcRenderer.send('exit-search')
});
$(document).ready(function() {
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        submitSearch();
        return false;
      }
    });
    $('#order').html(order)
    $('#modal').html(modal)
    $('#order').hide()

  })

function submitSearch() {
    console.log('submitsearch')
    var code = $.trim($('#inputSearch').val())
    console.log("input search:"+code)
    if (code != "") {
        let status = window.model.getSearchOrder(code)
        if(status==false){
            $('#order').html('')
            $('#not-found').html("<b>Order not found!</b>")
        }else{
            $('#not-found').html("")
            $('#order').show()
        }
    }
  $('#modalNext button.btn-primary').click(function(){
    var id = this.id.split('_')[1]
    var date = new Date()
    var today = '"'+date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+'"'
    console.log("click save to id="+id)
    var order = window.model.getOrderbyID(id)[0]
    var currentprocess = parseInt(order.proses)
    console.log("current process:"+currentprocess)
    var nextprocess = currentprocess+1
    var proses =''
      switch(nextprocess){
        case 0: proses = 'LKO'; break;
        case 1: proses = 'TUNGGU_KAIN'; break;
        case 2: proses = 'POTONG'; break;
        case 3: proses = 'FILM'; break;
        case 4: proses = 'SABLON'; break;
        case 5: proses = 'JAHIT'; break;
        case 6: proses = 'PACKING'; break;
        case 7: proses = 'BELUM_KIRIM'; break;
        case 8: proses = 'SUDAH_KIRIM';
      }
    window.model.updateData("order","proses",nextprocess,"`id_order`="+id)
    window.model.updateData("tanggal_proses",proses,today,"`id_order`="+id)
    window.model.saveFormData("log",{columns:['id_order','tanggal','proses'],values:[id,today,nextprocess]})
    submitSearch()
    ipcRenderer.send('update-order')
    $('#modalNext').modal('hide')
    $('#success-save').modal('show');
    
    setTimeout(function() {
        $('#success-save').modal('hide');
    }, 2000);
  })
  
  $('#modalDone button.btn-primary').click(function(){
    var id = this.id.split('_')[1]
    var date = new Date()
    var today = '"'+date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+'"'
    window.model.updateData("order","proses",9,"`id_order`="+id)
    window.model.saveFormData("log",{columns:['id_order','tanggal','proses'],values:[id,today,9]})
    submitSearch()
    ipcRenderer.send('update-order')
    $('#modalDone').modal('hide')
    $('#success-save').modal('show');
  
    setTimeout(function() {
        $('#success-save').modal('hide');
    }, 2000);
  })
}