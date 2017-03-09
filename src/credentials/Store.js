import fs from 'fs'
import path from 'path'
import {app, remote} from 'electron'
import config from '../config'


export default class Store {
    constructor() {
        this._dataFilePath = path.join((app || remote.app).getPath('userData'), config.credentials.dataFileName)
        this.data = this._parseDataFile()
    }

    _parseDataFile() {
        try {
            return JSON.parse(fs.readFileSync(this._dataFilePath))
        } catch (error) {
            return {}
        }
    }

    get(key) {
        return this.data[key]
    }

    set(key, value) {
        this.data[key] = value
        fs.writeFileSync(this._dataFilePath, JSON.stringify(this.data))
    }
}
