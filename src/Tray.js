import electron from 'electron'

import config from './config'
import MultifonClient from './MultifonClient'
import secret from './secret'


const routing = config.multifon.routing


export default class Tray {
    constructor() {
        const menu = electron.Menu.buildFromTemplate([
            {
                label: routing.phone.label, routing: routing.phone.value,
                type: 'radio', checked: true, click: event => {this.changeRouting(event)}
            },
            {
                label: routing.multifon.label, routing: routing.multifon.value,
                type: 'radio', click: event => {this.changeRouting(event)}
            },
            {
                label: routing.multifon_phone.label, routing: routing.multifon_phone.value,
                type: 'radio', click: event => {this.changeRouting(event)}
            },
            {label: 'Настройки', click: () => {this.showSettings()}},
            {label: 'Выход', click: this.quitApp},
        ])

        this.client = new MultifonClient(secret.username, secret.password)
        this.settingsWindow = null

        this.tray = new electron.Tray('./img/phone.png')
        this.tray.setToolTip('Multifon Switcher')
        this.tray.setContextMenu(menu)
    }

    changeRouting(event) {
        this.client.changeRouting(event.routing, error => {
            console.log(error)
        })
    }

    showSettings() {
        if (this.settingsWindow) return
        this.settingsWindow = new electron.BrowserWindow({width: 600, height: 400})
        this.settingsWindow.on("closed", () => {
            this.settingsWindow = null
        })
    }

    quitApp() {
        electron.app.quit()
    }
}
