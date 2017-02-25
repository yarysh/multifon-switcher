import keytar from 'keytar'
import Store from "./Store";


const store = new Store()


export default class Credentials {
    static get() {
        const login = store.get('login')
        if (!login) return null
        const password = keytar.getPassword(login, login)
        if (!password) return null
        return {'login': login, 'password': password}
    }

    static set(login, password) {
        const oldLogin = store.get('login')
        store.set('login', login)
        if (oldLogin) keytar.deletePassword(oldLogin, oldLogin)
        keytar.addPassword(login, login, password)
    }
}