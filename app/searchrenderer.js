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
  });
function submitSearch() {
    console.log('submitsearch')
    if(!$('.col-process').length){
        $('#order').html(order)
        $('#modal').html(modal)
    }
    var code = $.trim($('#inputSearch').val())
    console.log("input search:"+code)
    if (code != "") {
        let status = window.model.getSearchOrder(code)
        if(status==false){
            $('#order').html('')
            $('#modal').html('')
            $('#not-found').html("<b>Order not found!</b>")
        }else{
            $('#not-found').html("")
        }
    }
}
