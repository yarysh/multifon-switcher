import {app} from 'electron'
import Tray from'./Tray'


app.on('ready', () => { new Tray() })
app.on('window-all-closed', () => {})
