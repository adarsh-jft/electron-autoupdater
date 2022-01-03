const { app, BrowserWindow, Menu, ipcMain, dialog, autoUpdater } = require('electron')
const paths = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')

let updater;
let template = [
    { label: 'File', submenu: [{ label: 'Logout' }, { label: 'Quit', role: 'quit' }] }
]

let menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu)

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    })
    win.webContents.openDevTools()
    win.loadURL(isDev ? "http://localhost:3000" : `file://${paths.join(__dirname, "../build/index.html")}`)
}

app.whenReady().then(() => {
    createWindow()
}).catch(err => {
    console.log(err)
})

autoUpdater.autoDownload = false

ipcMain.on('checkForUpdates', (event, args) => {
    console.log('checking updates..........')
    autoUpdater.checkForUpdates()
})

autoUpdater.on('error', (err) => {
    console.log("error..........")
    dialog.showErrorBox('Error: ', err == null ? "Unknown" : (err.stack || err).toString())
})

autoUpdater.on('update-available', () => {
    console.log('update available.............')
    dialog.showMessageBox({
        type: 'info',
        title: 'Found Updates',
        message: 'Found updates, do you want to update now ?',
        buttons: ['Sure', 'No']
    }).then(buttonIndex => {
        if (buttonIndex === 0) {
            autoUpdater.downloadUpdate()
        } else {
            updater.enabled = true
            updater = null
        }
    })
})

autoUpdater.on('update-not-available', () => {
    console.log('update not available..............')
    dialog.showMessageBox({
        title: 'No Updates',
        message: 'Current version is up to date'
    })
    updater.enabled = true
    updater = null
})

autoUpdater.on('updated-download', () => {
        console.log('update download.................')
        dialog.showMessageBox({
            title: 'Install Updates',
            message: 'Updates downloaded, application will be closed for update...'
        }).then(() => {
            setImmediate(() => autoUpdater.quitAndInstall())
        })
    })
    // ipcMain.on("copy", (event, args) => {
    //     fs.copyFile("/home/jft-f01/Pictures/lot102.png", (paths.join(__dirname, 'InProcess/', `lot102.png`)), (err) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             console.log("copied")
    //         }
    //     })
    // })