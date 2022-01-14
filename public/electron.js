const { app, BrowserWindow, Menu, ipcMain, Notification, dialog } = require('electron')
const paths = require('path')
const { autoUpdater } = require('electron-updater')
const isDev = require('electron-is-dev')
const log = require('electron-log')

let NOTIFICATION_TITLE;
let NOTIFICATION_BODY;
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
        icon: paths.join(__dirname, 'logo192.png'),
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

autoUpdater.autoDownload = false

const sendStatusToWindow = (text) => {
    log.info(text)
    if (win) {
        win.webContents.send('message', text)
    }
}

autoUpdater.on('error', (err) => {
    NOTIFICATION_TITLE = 'Basic Notification'
    NOTIFICATION_BODY = 'Error checking Update'
    showNotification()
    sendStatusToWindow("error in auto update..........", err.toString())
})

autoUpdater.on('update-available', () => {
    let res;
    NOTIFICATION_TITLE = 'Basic Notification'
    NOTIFICATION_BODY = 'Update avaialable'
    showNotification()
    dialog.showMessageBox(win, {
        message: "HELLO",
        buttons: [
            'Yes',
            'No'

        ]
    }).then(res => {
        res = res.response;
        if (res === 0) {
            console.log("inside res")
            sendStatusToWindow("res value", res)
            autoUpdater.downloadUpdate()
        }
    })
    sendStatusToWindow('update available.............')
})

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    let downProg = progressObj.percent / 100
    downProg = downProg.toFixed(2)
        // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
    sendStatusToWindow(downProg);
    win.setProgressBar(downProg)
})
autoUpdater.on('update-downloaded', (info) => {
    NOTIFICATION_TITLE = 'Basic Notification'
    NOTIFICATION_BODY = 'Update downloaded'
    sendStatusToWindow('Update downloaded');
    showNotification()
        // autoUpdater.quitAndInstall()
});

autoUpdater.on('update-not-available', () => {
    NOTIFICATION_TITLE = 'Basic Notification'
    NOTIFICATION_BODY = 'Update not available'
    showNotification()
    sendStatusToWindow('update not available..............')
})

app.whenReady().then(() => {
    createWindow()
    autoUpdater.checkForUpdates()
}).catch(err => {
    console.log(err)
})

function showNotification() {
    new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

// ipcMain.on("copy", (event, args) => {
//     fs.copyFile("/home/jft-f01/Pictures/lot102.png", (paths.join(__dirname, 'InProcess/', `lot102.png`)), (err) => {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log("copied")
//         }
//     })
// })