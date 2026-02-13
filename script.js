'use strict'

const title = document.getElementsByTagName('h1')[0];
const startBtn = document.getElementsByClassName('handler_btn')[0]
const resetBtn = document.getElementsByClassName('handler_btn')[1]
const buttonPlus = document.querySelector('.screen-btn')
const otherItemsPercent = document.querySelectorAll('.other-items.percent')
const otherItemsNumber = document.querySelectorAll('.other-items.number')
const inputRange = document.querySelector('.rollback input[type=range]')
const span = document.querySelector('.rollback span')
const total = document.getElementsByClassName('total-input')[0]
const totalCount = document.getElementsByClassName('total-input')[1]
const totalCountOther = document.getElementsByClassName('total-input')[2]
const fullTotalCount = document.getElementsByClassName('total-input')[3]
const totalCountRollback = document.getElementsByClassName('total-input')[4]

let screens = document.querySelectorAll('.screen')

const appData = {
    title: '',
    screens: [],
    screenPrice: 0,
    adaptive: true,

    rollback: 10,
    servicePricesPercent: 0,
    servicePricesNumber: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    servicesPercent: {},
    servicesNumber: {},
    init: function () {
        appData.addTitle()
        appData.getSlider();
        startBtn.addEventListener('click', () => {
            appData.start()
            const rollbackPercent = +appData.getRollback();
            appData.totalCountWithRollback = appData.fullPrice - (appData.fullPrice * (rollbackPercent / 100))
            appData.showResult();
        })
        buttonPlus.addEventListener('click', appData.addScreenBlock)
        appData.attachEventListeners();
        appData.checkFields();
    },
    addTitle: function () {
        document.title = title.textContent;
    },
    start: function () {
        appData.addScreens()
        appData.addServices()
        appData.addPrices();
        // appData.logger();
        appData.showResult();
    },
    showResult: function () {
        total.value = appData.fullPrice;
        totalCountOther.value = appData.servicePricesPercent + appData.servicePricesNumber
        fullTotalCount.value = this.fullPrice
        totalCountRollback.value = appData.totalCountWithRollback
        totalCount.value = appData.totalScreenCount
    },
    addScreens: function () {
        let screens = document.querySelectorAll('.screen')

        screens.forEach(function (screen, index) {
            const select = screen.querySelector('select')
            const input = screen.querySelector('input')
            const selectName = select.options[select.selectedIndex].textContent
            const count = +input.value
            appData.screens.push({
                id: index,
                name: selectName,
                price: +select.value * count,
                count: count
            })
        })
    },
    addServices: function () {
        otherItemsPercent.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox')
            const label = item.querySelector('label')
            const input = item.querySelector('input[type=text]')
            if (check.checked) {
                appData.servicesPercent[label.textContent] = +input.value
            }
        })
        otherItemsNumber.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox')
            const label = item.querySelector('label')
            const input = item.querySelector('input[type=text]')
            if (check.checked) {
                appData.servicesNumber[label.textContent] = +input.value
            }
        })
    },
    addScreenBlock: function () {
        const cloneScreen = screens[0].cloneNode(true)
        screens[screens.length - 1].after(cloneScreen)
        screens = document.querySelectorAll('.screen')
        appData.attachEventListeners();
        appData.checkFields();
    },
    attachEventListeners: function () {
        screens.forEach(screen => {
            const select = screen.querySelector('select')
            const input = screen.querySelector('input')

            select.removeEventListener('change', appData.checkFields)
            input.removeEventListener('input', appData.checkFields)

            select.addEventListener('change', appData.checkFields)
            input.addEventListener('input', appData.checkFields)
        })
    },
    checkFields: function () {
        let allFilled = true
        const mainControlSelect = document.querySelectorAll('.main-controls__item.screen')
        mainControlSelect.forEach(block => {
            const select = block.querySelector('select')
            const input = block.querySelector('input')
            const selectValid = select.value !== ''
            const inputValid = input.value.trim() !== '' && parseInt(input.value) > 0;
            if (!selectValid || !inputValid) {
                allFilled = false;
            }
        })
        startBtn.disabled = !allFilled
    },
    addPrices: function () {
        let totalScreenCount = 0
        appData.screens.forEach(function (screen) {
            totalScreenCount += screen.count
        })
        appData.totalScreenCount = totalScreenCount

        appData.screenPrice = 0
        for (let screen of appData.screens) {
            appData.screenPrice = appData.screens.reduce((sum, screen) => sum + (+screen.price), 0)
        }
        for (let key in appData.servicesNumber) {
            appData.servicePricesNumber += appData.servicesNumber[key]
        }
        for (let key in appData.servicesPercent) {
            appData.servicePricesPercent += appData.screenPrice * (appData.servicesPercent[key] / 100)
        }
        appData.fullPrice = appData.screenPrice + appData.servicePricesPercent + appData.servicePricesNumber
        const rollbackValue = +appData.getRollback();
        appData.totalCountWithRollback = appData.fullPrice - (appData.fullPrice * (rollbackValue / 100))
    },
    getSlider: function () {
        const mainControlsRollback = document.querySelector('.main-controls__item.rollback')
        const span = mainControlsRollback.querySelector('span')
        inputRange.addEventListener('input', () => {
            const value = inputRange.value
            appData.rollback = value
            span.textContent = value + '%';
            // appData.addPrices();
            // appData.showResult();
        })
    },
    getRollback: function () {
        return +appData.rollback;
    },
    logger: function () {
        console.log(this.fullPrice);
        console.log(this.servicePercentPrice);
        console.log(appData.screens);
    }
}

appData.init();