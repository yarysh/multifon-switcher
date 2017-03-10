import {app} from 'electron'
import {Tray} from "./components";


app.dock.hide()
app.on('ready', () => {new Tray()})
app.on('window-all-closed', () => {})