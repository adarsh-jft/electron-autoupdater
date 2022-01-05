const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const paths = require('path')
const { autoUpdater } = require('electron-updater')
const fs = require('fs')
const isDev = require('electron-is-dev')
const log = require('electron-log')

let updater;
let win;
let template = [
    { label: 'File', submenu: [{ label: 'Logout' }, { label: 'Quit', role: 'quit' }] }
]

let menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu)

function createWindow() {
    win = new BrowserWindow({
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

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

app.whenReady().then(() => {
    createWindow()
}).catch(err => {
    console.log(err)
})

autoUpdater.autoDownload = false

const sendStatusToWindow = (text) => {
    log.info(text)
    if (win) {
        win.webContents.send('message', text)
    }
}

ipcMain.on('checkForUpdates', (event, args) => {
    sendStatusToWindow('checking updates..........')
        // dialog.showMessageBox({
        //     title: 'Checking'
        // })
    autoUpdater.checkForUpdates()
})

autoUpdater.on('error', (err) => {
    sendStatusToWindow("error in auto update..........", err.toString())
        // dialog.showErrorBox('Error: ', err == null ? "Unknown" : (err.stack || err).toString())
})

autoUpdater.on('update-available', () => {
    sendStatusToWindow('update available.............')
        // dialog.showMessageBox({
        //     type: 'info',
        //     title: 'Found Updates',
        //     message: 'Found updates, do you want to update now ?',
        //     buttons: ['Sure', 'No']
        // }).then(buttonIndex => {
        //     if (buttonIndex === 0) {
        //         autoUpdater.downloadUpdate()
        //     } else {
        //         updater.enabled = true
        //         updater = null
        //     }
        // })
})

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});

autoUpdater.on('update-not-available', () => {
    sendStatusToWindow('update not available..............')
        // dialog.showMessageBox({
        //     title: 'No Updates',
        //     message: 'Current version is up to date'
        // })
    updater.enabled = true
    updater = null
})

autoUpdater.on('updated-download', () => {
        sendStatusToWindow('update download.................')
        autoUpdater.quitAndInstall()
            // dialog.showMessageBox({
            //     title: 'Install Updates',
            //     message: 'Updates downloaded, application will be closed for update...'
            // }).then(() => {
            //     setImmediate(() => autoUpdater.quitAndInstall())
            // })
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