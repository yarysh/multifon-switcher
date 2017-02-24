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
                type: 'radio', checked: true, click: (event) => {this._onChangeMode(event)}
            },
            {
                label: routing.multifon.label, routing: routing.multifon.value,
                type: 'radio', click: (event) => {this._onChangeMode(event)}
            },
            {
                label: routing.multifon_phone.label, routing: routing.multifon_phone.value,
                type: 'radio', click: (event) => {this._onChangeMode(event)}
            },
            {label: 'Настройки', click: this._onSettings},
            {label: 'Выход', click: this._onQuit},
        ])

        this.client = new MultifonClient(secret.username, secret.password)
        this.tray = new electron.Tray('./img/phone.png')
        this.tray.setToolTip('Multifon Switcher')
        this.tray.setContextMenu(menu)
    }

    _onChangeMode(event) {
        this.client.changeRouting(event.routing, function (status, data) {
            console.log(status)
            console.log(data)
        })
    }

    _onSettings(event) {
        console.log('settings')
    }

    _onQuit() {
        electron.app.quit()
    }
}
