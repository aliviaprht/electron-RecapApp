'use strict'
const electron = require('electron')
const url = require ('url')
const path = require('path')
const {app, BrowserWindow} = electron
const globalShortcut = electron.globalShortcut
const os = require('os')
const config = require(path.join(__dirname, 'package.json'))
const model = require(path.join(__dirname, 'app', 'model.js'))
let mainWindow;

//Listen for app to be ready
app.on('ready', function () {
	//Create new window
	mainWindow = new BrowserWindow({});
	
	//Load html window
    model.initDb(app.getPath('userData'),
    // Load a DOM stub here. See renderer.js for the fully composed DOM.
    mainWindow.loadURL(url.format({
		pathname : path.join(__dirname,'app/html/mainPage.html'),
		protocol : 'file:',
		slashes: true
	}))
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

//   mainWindow.once('ready-to-show', () => {
//     mainWindow.setMenu(null)
//     mainWindow.show()
//   })

//   mainWindow.onbeforeunload = (e) => {
//     // Prevent Command-R from unloading the window contents.
//     e.returnValue = false
//   }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})

app.on('window-all-closed', () => { app.quit() })