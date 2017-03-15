import path from 'path'


export default {
    credentials: {
        dataFileName: 'multifon-switcher.dat'
    },
    multifon: {
        getRoutingUrl: 'https://sm.megafon.ru/sm/client/routing',
        setRoutingUrl: 'https://sm.megafon.ru/sm/client/routing/set',
        routing: {
            phone: {label: 'На телефон', value: 0},
            multifon: {label: 'В Мультифон', value: 1},
            multifon_phone: {label: 'Мультифон + телефон', value: 2},
        }
    },
    icons: {
        loading: path.join(__dirname, 'assets/loadingTemplate.png'),
        error: path.join(__dirname, 'assets/errorTemplate.png'),
        noCred: path.join(__dirname, 'assets/noCredTemplate.png'),
        routing0: path.join(__dirname, 'assets/routing0Template.png'),
        routing1: path.join(__dirname, 'assets/routing1Template.png'),
        routing2: path.join(__dirname, 'assets/routing2Template.png')
    },
    tray: {
        toolTip: 'Multifon Switcher'
    },
    settingsWindow: {
        width: 600,
        height: 400,
        content: 'SettingsWindow.html'
    },
    errorWindow: {
        width: 500,
        height: 200,
        content: 'ErrorWindow.html'
    },
}
