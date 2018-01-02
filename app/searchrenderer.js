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
let searchItem = fs.readFileSync(path.join(htmlPath, 'searchItem.html'), 'utf8')
let order = fs.readFileSync(path.join(htmlPath, 'order.html'), 'utf8')
let modal = fs.readFileSync(path.join(htmlPath, 'modal.html'), 'utf8')
let O = cheerio.load(body)
O('#order').append(order)
O('#modal').append(modal)

// Pass the DOM from Cheerio to jQuery.
let dom = O.html()
$('searchItem').html(dom)
console.log("document inserted")

$('document').ready(function () {
    console.log("searchrenderer.js")
})

$('#exit-search').click( function () {
    console.log("exit-search")
    ipcRenderer.send('exit-search')
});

function submitSearch() {
    var code = $.trim($('#inputSearch').val())
    if (code != "") {
        window.model.getSearchOrder(code)
    }
}