import {net} from 'electron'

import config from './config'


export default class MultifonClient {
    /**
     * Initialize a client
     * @param {string} login - Multifon login, e.g. 7XXXXXXXXXX@multifon.ru
     * @param {string} password - Multifon password
     */
    constructor(login, password) {
        this.login = login;
        this.password = password;
    }

    /**
     * Build url for changing routing mode
     * @param {number} value - Multifon routing value
     */
    _buildChangeRoutingUrl(value) {
        return config.multifon.url + '?login=' + this.login + '&password=' + this.password + '&routing=' + value
    }

    /**
     * Change routing mode
     * @param {number} value - Multifon routing mode
     * @param {function} callback - Takes 2 args: statusCode, response.data
     */
    changeRouting(value, callback) {
        const request = net.request(this._buildChangeRoutingUrl(value))
        request.on('response', function (response) {
            response.on('data', function (chunk) {
                callback(response.statusCode, chunk.toString('utf8'))
            })
        })
        request.end()
    }
}