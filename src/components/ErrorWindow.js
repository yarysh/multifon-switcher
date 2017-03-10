import path from 'path'
import url from 'url'
import {BrowserWindow, ipcMain} from 'electron'

import {Credentials} from '../credentials'
import config from '../config'


export default class ErrorWindow {
    constructor(title, content) {
        const window = new BrowserWindow({
            width: config.errorWindow.width,
            height: config.errorWindow.height,
            maximizable: false,
            minimizable: false,
            resizable: false,
            show: false
        })
        window.loadURL(url.format({
            pathname: path.join(__dirname, config.errorWindow.content),
            protocol: 'file:',
            slashes: true
        }))
        window.once('ready-to-show', () => {
            window.webContents.send('load-error', {'title': title, 'content': content})
            window.show()
        })
        window.on('closed', () => {this.window = null})
    }
}
