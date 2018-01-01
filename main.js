'use strict'
const electron = require('electron')
const url = require ('url')
const path = require('path')
const {app, ipcMain} = electron
const globalShortcut = electron.globalShortcut
const os = require('os')
const config = require(path.join(__dirname, 'package.json'))
const model = require(path.join(__dirname, 'app', 'model.js'))
var mainWindow = null
var formWindow = null
const BrowserWindow = electron.BrowserWindow

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    backgroundColor: 'lightgray',
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  
    model.initDb(app.getPath('userData'),
      // Load a DOM stub here. See renderer.js for the fully composed DOM.
      mainWindow.loadURL(`file://${__dirname}/app/html/index.html`)
    )
  
    // Enable keyboard shortcuts for Developer Tools on various platforms.
    let platform = os.platform()
    if (platform === 'darwin') {
      globalShortcut.register('Command+Option+I', () => {
        mainWindow.webContents.openDevTools()
      })
    } else if (platform === 'linux' || platform === 'win32') {
      globalShortcut.register('Control+Shift+I', () => {
        mainWindow.webContents.openDevTools()
      })
    }

    mainWindow.once('ready-to-show', () => {
      mainWindow.setMenu(null)
      mainWindow.show()
    })
  
    mainWindow.onbeforeunload = (e) => {
      // Prevent Command-R from unloading the window contents.
      e.returnValue = false
    }
  
    mainWindow.on('closed', function () {
      mainWindow = null
    })
  })
  
  app.on('window-all-closed', () => { app.quit() })

   
// Handle add item window
function createAddWindow(){
  formWindow = new BrowserWindow({
    title:'Add Order'
  });
  formWindow.loadURL(`file://${__dirname}/app/html/formOrder.html`)
  // Handle garbage collection
  formWindow.on('close', function(){
    formWindow = null;
  });
}

// Handle search item window
function createSearchWindow(){
  formWindow = new BrowserWindow({
      title: 'Search Order'
  });
    formWindow.loadURL(`file://${__dirname}/app/html/searchItem.html`)
    // Handle garbage collection
    formWindow.on('close', function(){
        formWindow = null;
    });
}

// Catch open-form
ipcMain.on('open-form', (event, arg)=> {
  if(formWindow==null){
    createAddWindow()
  }
})
// Catch close-form
ipcMain.on('close-form', (event, arg)=> {
  if(formWindow!=null){
    formWindow.close()
  }
})
ipcMain.on('close-form-submit', (event, arg)=> {
  if(formWindow!=null){
    mainWindow.webContents.send('close-form-submit')
    formWindow.close()
  }
})
// Catch search-item
ipcMain.on('search-item', (event,arg)=> {
  if (formWindow!=null){
    createSearchWindow()
  }
})
// Catch exit-search
ipcMain.on('exit-search', (event, arg)=> {
    if(formWindow!=null){
        formWindow.close()
    }
})