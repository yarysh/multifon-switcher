import path from 'path'
import url from 'url'
import {BrowserWindow, ipcMain} from 'electron'
import {Credentials} from '../credentials'
import config from '../config'


export default class SettingsWindow {
    constructor() {
        this.window = null
        ipcMain.on('save-settings', (event, data) => {
            if (data['login'] && data['password']) {
                Credentials.set(data['login'], data['password'])
            }
        })
    }

    show() {
        if (this.window) return
        this.window = new BrowserWindow({
            width: config.settingsWindow.width,
            height: config.settingsWindow.height,
            maximizable: false,
            show: false
        })
        this.window.loadURL(url.format({
            pathname: path.join(__dirname, config.settingsWindow.content),
            protocol: 'file:',
            slashes: true
        }))
        this.window.webContents.openDevTools()
        this.window.once('ready-to-show', () => {
            const credentials = Credentials.get()
            if (credentials) {
                this.window.webContents.send('load-settings', credentials)
            }
            this.window.show()
        })
        this.window.on('closed', () => {this.window = null})
    }
}
