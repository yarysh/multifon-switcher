export default {
    credentials: {
        dataFileName: 'multifon-switcher.dat'
    },
    multifon: {
        url: 'https://sm.megafon.ru/sm/client/routing/set',
        routing: {
            phone: {label: 'На телефон', value: 0},
            multifon: {label: 'В Мультифон', value: 1},
            multifon_phone: {label: 'Мультифон + телефон', value: 2},
        }
    },
    tray: {
        icon: './assets/phone.png',
        toolTip: 'Multifon Switcher'
    },
    settingsWindow: {
        width: 600,
        height: 400,
        content: 'SettingsWindow.html'
    }
}
