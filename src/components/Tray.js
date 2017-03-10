import electron from 'electron'

import {MultifonClient} from '../utils'
import SettingsWindow from './SettingsWindow'
import config from '../config'


export default class Tray {
    constructor() {
        this.tray = new electron.Tray(config.tray.icon)
        this.tray.setToolTip(config.tray.toolTip)
        this.menu = this._buildContextMenu()
        this.tray.setContextMenu(this.menu)
        this.multifonClient = new MultifonClient(itemId => {this.menuItemSwitcher(itemId)})
        this.settingsWindow = new SettingsWindow(this.multifonClient)
        // this.multifonClient.checkCurrentRouting()
    }

    _buildContextMenu() {
        const routing = config.multifon.routing
        return electron.Menu.buildFromTemplate([
            {
                label: routing.phone.label, routing: routing.phone.value,
                type: 'radio', checked: true, click: item => {this.multifonClient.changeRouting(item.routing)}
            },
            {
                label: routing.multifon.label, routing: routing.multifon.value,
                type: 'radio', click: item => {this.multifonClient.changeRouting(item.routing)}
            },
            {
                label: routing.multifon_phone.label, routing: routing.multifon_phone.value,
                type: 'radio', click: item => {this.multifonClient.changeRouting(item.routing)}
            },
            {type: 'separator'},
            {label: 'Настройки', click: () => {this.settingsWindow.show()}},
            {label: 'Выход', click: this.quitApp},
        ])
    }

    menuItemSwitcher(itemId) {
        this.menu.items[itemId].checked = true
        this.tray.setImage('./assets/routing' + itemId + 'Template.png')
    }

    quitApp() {
        electron.app.quit()
    }
}
