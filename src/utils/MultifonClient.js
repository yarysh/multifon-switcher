import querystring from 'querystring'
import {net} from 'electron'

import config from '../config'


const codeRegexp = new RegExp('<code>(\\d+)</code>', 'i')
const descRegexp = new RegExp('<description>(.*?)</description>', 'i')


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

    /**
     * Build url for changing routing mode
     * @param {number} value - Multifon routing value
     */
    _buildChangeRoutingUrl(value) {
        return [
            config.multifon.url,
            querystring.stringify({login: this.login, password: this.password, routing: value})
        ].join('?')
    }

    /**
     * Parse response of routing changes
     * @param {string} data - response
     */
    _parseChangeRoutingData(data) {
        const code = data.match(codeRegexp)
        const desc = data.match(descRegexp)
        let result = {code: null, desc: null}
        if (code) result.code = parseInt(code[1], 10)
        if (desc) result.desc = desc[1]
        return result
    }

    /**
     * Change routing mode
     * @param {number} value - Multifon routing mode
     * @param {function} callback - A callback takes optional arg error={code: <error code>, desc: <error description>}
     */
    changeRouting(value, callback) {
        const request = net.request(this._buildChangeRoutingUrl(value))
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
