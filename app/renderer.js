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
window.model.db = path.join(app.getPath('userData'), 'example.db')
window.form = require(path.join(webRoot, 'detail.js'))

// Compose the DOM from separate HTML concerns; each from its own file.
let htmlPath = path.join(app.getAppPath(), 'app', 'html')
let body = fs.readFileSync(path.join(htmlPath, 'body.html'), 'utf8')
let navbar = fs.readFileSync(path.join(htmlPath, 'navbar.html'), 'utf8')
let order = fs.readFileSync(path.join(htmlPath, 'order.html'), 'utf8')
let modal = fs.readFileSync(path.join(htmlPath, 'modal.html'), 'utf8')
let O = cheerio.load(body)
O('#navbar').append(navbar)
O('#order').append(order)
O('#modal').append(modal)

// Pass the DOM from Cheerio to jQuery.
let dom = O.html()
$('body').html(dom)
console.log("document inserted")
$('document').ready(function () {
  window.model.getOrder()
  var today = new Date()
  var day,month = ''
  switch(today.getDay()){
    case 1: day = 'Senin'; break;
    case 2: day = 'Selasa'; break;
    case 3: day = 'Rabu'; break;
    case 4: day = 'Kamis'; break;
    case 5: day = 'Jumat'; break;
    case 6: day = 'Sabtu'; break;
    case 0: day = 'Minggu'; break;
  }
  switch(today.getMonth()){
    case 0: month = 'Januari'; break;
    case 1: month = 'Februari'; break;
    case 2: month = 'Maret'; break;
    case 3: month = 'April'; break;
    case 4: month = 'Mei'; break;
    case 5: month = 'Juni'; break;
    case 6: month = 'Juli'; break;
    case 7: month = 'Agustus'; break;
    case 8: month = 'September'; break;
    case 9: month = 'Oktober'; break;
    case 10: month = 'November'; break;
    case 11: month = 'Desember'; break;
  }
  var date = 'Tanggal: '+day+', '+today.getDate()+' '+month+' '+today.getFullYear()
  console.log("today: "+date)
  $('#date_today').html(date)
  $('button.detail').hide()
  $('button.next').hide()
  
$('.box-process').hover(
  function(){
    console.log($(this).attr('id'))
    $('#detail_'+this.id.split('_')[1]).show()
    $('#next_'+this.id.split('_')[1]).show()
  },
  function(){
    $('#detail_'+this.id.split('_')[1]).hide()
    $('#next_'+this.id.split('_')[1]).hide()
  }
)
})


$('#new-order').click( function () {           
    ipcRenderer.send('open-form');
    console.log("open-form")
});

$('#search-item').click( function () {
    ipcRenderer.send('search-item');
    console.log("open-search-item")
})

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
  window.model.getOrder()
  $('#modalNext').modal('hide')
  $('#success-save').modal('show');

  setTimeout(function() {
      $('#success-save').modal('hide');
  }, 2000);
})

$('#modalDone button.btn-primary').click(function(){
  var id = this.id.split('_')[1]
  window.model.updateData("order","proses",9,"`id_order`="+id)
  window.model.getOrder()
  $('#modalDone').modal('hide')
  $('#success-save').modal('show');

  setTimeout(function() {
      $('#success-save').modal('hide');
  }, 2000);
})

ipcRenderer.on('close-form-submit',(event,arg)=>{
  console.log('close-form-submit')
  window.model.getOrder()
})

ipcRenderer.on('exit-search', (event,arg)=>{
    console.log('exit-search')
    window.model.getOrder()
})
