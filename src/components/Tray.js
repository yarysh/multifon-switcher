import electron from 'electron'
import {Credentials} from '../credentials'
import {MultifonClient} from '../utils'
import SettingsWindow from './SettingsWindow'
import config from '../config'


export default class Tray {
    constructor() {
        this.tray = new electron.Tray(config.tray.icon)
        this.tray.setToolTip(config.tray.toolTip)
        this.menu = this._buildContextMenu()
        this.tray.setContextMenu(this.menu)

        this.multifonClient = new MultifonClient(Credentials.get())
        this.settingsWindow = new SettingsWindow(this.tray)

        this.multifonClient.getCurrentRouting((currentRouting, error) => {
            if (!error) this.menu.items[currentRouting].checked = true
        });
    }

    _buildContextMenu() {
        const routing = config.multifon.routing
        return electron.Menu.buildFromTemplate([
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
            {type: 'separator'},
            {label: 'Настройки', click: () => {this.settingsWindow.show()}},
            {label: 'Выход', click: this.quitApp},
        ])
    }

    changeRouting(event) {
        this.multifonClient.changeRouting(event.routing, error => {
            console.log(error)
        })
    }

    quitApp() {
        electron.app.quit()
    }
}
