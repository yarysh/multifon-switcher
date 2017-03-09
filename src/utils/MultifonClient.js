import querystring from 'querystring'
import {net} from 'electron'

import config from '../config'


const codeRegexp = new RegExp('<code>(\\d+)</code>', 'i')
const descRegexp = new RegExp('<description>(.*?)</description>', 'i')
const routingRegexp = new RegExp('<routing>(.*?)</routing>', 'i')


export default class MultifonClient {
    /**
     * Initialize a client
     * @param {Object||null} credentials - Multifon credentials {login: <login>, password: <password>}
     */
    constructor(credentials={}) {
        this.login = credentials['login']
        this.password = credentials['password']
    }

    setCredentials(credentials) {
        this.login = credentials['login']
        this.password = credentials['password']
    }

    _buildUrl(url, params={}) {
        return [
            url, querystring.stringify(Object.assign({login: this.login, password: this.password}, params))
        ].join('?')
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

    /**
     * Get current routing mode
     * @param {function} callback - A callback takes optional args: currentRouting, error={code: <error code>, desc: <error description>}
     */
    getCurrentRouting(callback) {
        const request = net.request(this._buildUrl(config.multifon.getRoutingUrl))
        request.on('response', (response) => {
            response.on('data', (data) => {
                if (response.statusCode !== 200) return callback(null, {code: response.statusCode, desc: null})
                const result = this._parseCurrentRoutingData(data.toString('utf8'))
                result.code === 200 ? callback(result.routing, null) : callback(null, result)
            })
        })
        request.end()
    }

    /**
     * Change routing mode
     * @param {number} value - Multifon routing mode
     * @param {function} callback - A callback takes optional arg error={code: <error code>, desc: <error description>}
     */
    changeRouting(value, callback) {
        const request = net.request(this._buildUrl(config.multifon.setRoutingUrl, {routing: value}))
        request.on('response', (response) => {
            response.on('data', (data) => {
                if (response.statusCode !== 200) return callback({code: response.statusCode, desc: null})
                const result = this._parseChangeRoutingData(data.toString('utf8'))
                result.code === 200 ? callback(null) : callback(result)
            })
        })
        request.end()
    }
}
