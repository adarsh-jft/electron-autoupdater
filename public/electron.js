const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const paths = require('path')
    // const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')
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

// ipcMain.on("copy", (event, args) => {
//     fs.copyFile("/home/jft-f01/Pictures/lot102.png", (paths.join(__dirname, 'InProcess/', `lot102.png`)), (err) => {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log("copied")
//         }
//     })
// })