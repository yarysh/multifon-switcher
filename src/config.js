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
    tray: {
        icon: './assets/routing0Template.png',
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
    }
}
