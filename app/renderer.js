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

// Compose the DOM from separate HTML concerns; each from its own file.
let htmlPath = path.join(app.getAppPath(), 'app', 'html')
let body = fs.readFileSync(path.join(htmlPath, 'body.html'), 'utf8')
let navbar = fs.readFileSync(path.join(htmlPath, 'navbar.html'), 'utf8')
let order = fs.readFileSync(path.join(htmlPath, 'order.html'), 'utf8')
let modal = fs.readFileSync(path.join(htmlPath, 'modal.html'), 'utf8')
let history = fs.readFileSync(path.join(htmlPath, 'history.html'), 'utf8')
let O = cheerio.load(body)
O('#navbar').append(navbar)
O('#order').append(order)
O('#modal').append(modal)
O('#history').append(history)

// Pass the DOM from Cheerio to jQuery.
let dom = O.html()
$('body').html(dom)
$("#to-delete-history").hide()
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
  $('#history-list').hide()

  var date = 'Tanggal: '+day+', '+today.getDate()+' '+month+' '+today.getFullYear()
  console.log("today: "+date)
  $('#date_today').html(date)
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
  var today = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()
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
  window.model.updateData("tanggal_proses",proses,'"'+today+'"',"`id_order`="+id)
  window.model.saveFormData("log",{columns:['id_order','tanggal','hari','proses_baru'],values:[id,today,date.getDay(),nextprocess]})
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
ipcRenderer.on('update-order',(event,arg)=>{
  console.log('update-order')
  window.model.getOrder()
})
ipcRenderer.on('exit-search', (event,arg)=>{
    console.log('exit-search')
    window.model.getOrder()
})

$('#navbar-history').click(function(){
  if(!$(this).hasClass('active')){
    $(this).addClass('active')
    $('#navbar-home').removeClass('active')
    $('#order-list').hide()
    $('#history-list').show()
    $('#title').html('HISTORY')
    $('#date_today').hide()
    $('#new-order').hide()
    $('#history-found').html('')
    let status = window.model.getHistory(20,0)
    if(status==false){
      $('#history-not-found').html('No history found')
    }else{
      $('#history-not-found').html('')
    }
  }else{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
})

$('#navbar-home').click(function(){
  if(!$(this).hasClass('active')){
    $(this).addClass('active')
    $('#navbar-history').removeClass('active')
    $('#history-list').hide()
    $('#to-delete-history').hide()
    $('#order-list').show()
    $('#title').html('WORK IN PROCESS')
    $('#date_today').show()
    $('#new-order').show()
    $('#head').show()
    $('#allcheck').val(0)
  }
})

$('#cancel-delete').click(function(){
  $.each($("input[name='deletehistory']"), function(){
    $(this).prop('checked',false)
  }); 
  $('#allcheck').val(0)
  $('#to-delete-history').hide()
  $('#head').show()
})
$('#delete-history').click(function(){
  $.each($("input[name='deletehistory']:checked"), function(){
    model.deleteHistory([parseInt(this.id.split('_')[1])])
    let tanggal = $('#tanggal_'+this.id.split('_')[1]).val()
    console.log("tanggal yg delete :"+tanggal)
    let jumlah_history = parseInt($('#jumlah-history_'+tanggal).val())
    $('#jumlah-history_'+tanggal).val(jumlah_history-1)
    console.log("jumlah history "+tanggal+"="+$('#jumlah-history_'+tanggal).val())
    $('#history_'+this.id.split('_')[1]).remove()
    let jumlah_all_history =  parseInt($('#jumlah-all-history').val())
    $('#jumlah-all-history').val(jumlah_all_history-1)
    if(jumlah_history==1){
        $('#history_'+tanggal).remove()
    }
    if(parseInt($('#jumlah-all-history').val())==0){
      $('#history-not-found').html('No history found')
    }
  }); 
  $('#to-delete-history').hide()
  $('#head').show()
  $('#allcheck').val(0)
})