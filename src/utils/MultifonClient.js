import querystring from 'querystring'
import {net} from 'electron'

import {Credentials} from '../credentials'
import ErrorWindow from "../components/ErrorWindow";
import config from '../config'


const codeRegexp = new RegExp('<code>(\\d+)</code>', 'i')
const descRegexp = new RegExp('<description>(.*?)</description>', 'i')
const routingRegexp = new RegExp('<routing>(.*?)</routing>', 'i')


export default class MultifonClient {
    constructor(tray) {
        this.tray = tray
    }

    _buildUrl(url, credentials, params={}) {
        return [url, querystring.stringify(Object.assign(credentials, params))].join('?')
    }

    _makeRequest(url, params, callback) {
        this.tray.setLoadingStatus()
        const credentials = Credentials.get()
        if (!credentials) return this.tray.setNoCredentialsStatus()
        const request = net.request(this._buildUrl(url, params || {}, credentials))
        request.on('response', response => {
            response.on('data', data => {
                if (response.statusCode === 200) return callback(data.toString('utf8'))
                this.tray.setErrorStatus()
                return new ErrorWindow('Не удалось отправить запрос', 'Ошибка отправки запроса ' + response.statusCode)
            })
        })
        request.end()
    }

    _parseCurrentRoutingData(data) {
        const code = data.match(codeRegexp)
        const desc = data.match(descRegexp)
        const routing = data.match(routingRegexp)
        let result = {code: null, desc: null, routing: null}
        if (code) result.code = parseInt(code[1], 10)
        if (desc) result.desc = desc[1]
        if (routing) result.routing = parseInt(routing[1], 10)
        return result
    }

    _parseChangeRoutingData(data) {
        const code = data.match(codeRegexp)
        const desc = data.match(descRegexp)
        let result = {code: null, desc: null}
        if (code) result.code = parseInt(code[1], 10)
        if (desc) result.desc = desc[1]
        return result
    }

    checkCurrentRouting() {
        this._makeRequest(config.multifon.getRoutingUrl, null, (response) => {
            const data = this._parseCurrentRoutingData(response)
            if (data.code === 200) return this.tray.setRoutingStatus(data.routing)
            this.tray.setErrorStatus()
            return new ErrorWindow('Не удалось получить текущий режим приема', 'Ошибка ' + data.code + ': ' + data.desc)
        })
    }

    changeRouting(value) {
        this._makeRequest(config.multifon.setRoutingUrl, {routing: value}, (response) => {
            const data = this._parseChangeRoutingData(response)
            if (data.code === 200) return this.tray.setRoutingStatus(value)
            this.tray.setErrorStatus()
            return new ErrorWindow('Не удалось изменить режим приема', 'Ошибка ' + data.code + ': ' + data.desc)
        })
    }
}
