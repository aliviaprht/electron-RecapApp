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
window.form = require(path.join(webRoot, 'form.js'))

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
})

window.ipc = window.ipc || {},
function(n) {
     ipc.messaging = {

         sendOpenFormEvent: function() {
             ipcRenderer.send('open-form', 'an-argument')
         },

        init: function() {
            $('#new-order').click( function () {
            ipc.messaging.sendOpenFormEvent()
        })
    }
 };

 n(function() {
     ipc.messaging.init();
 })

}(jQuery);