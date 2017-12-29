'use strict'
const path = require('path')
const model = require(path.join(__dirname, 'model.js'))
const {ipcRenderer} = require('electron')


window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')
//submit form
    //validate no.LKO

    //add data to db
$('document').ready(function () {
    console.log("form.js")
})
$('#cancel-form').click( function () {
    console.log("close-form")
    ipcRenderer.send('close-form')
});
