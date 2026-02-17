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
        this.addTitle()
        this.getSlider();
        startBtn.addEventListener('click', () => {
            appData.start();
            appData.lockInputsAndSelects();
            appData.reset();
        })
        buttonPlus.addEventListener('click', appData.addScreenBlock)
        this.attachEventListeners();
        this.checkFields();

        document.getElementById('reset').addEventListener('click', () => {
            this.unlockInputsAndSelects();
            this.reset(false);
        });
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
        total.value = this.fullPrice;
        totalCountOther.value = this.servicePricesPercent + this.servicePricesNumber
        fullTotalCount.value = this.fullPrice
        totalCountRollback.value = this.totalCountWithRollback
        totalCount.value = this.totalScreenCount
    },
    addScreens: function () {
        let screens = document.querySelectorAll('.screen')

        screens.forEach((screen, index) => {
            const select = screen.querySelector('select')
            const input = screen.querySelector('input')
            const selectName = select.options[select.selectedIndex].textContent
            const count = +input.value
            this.screens.push({
                id: index,
                name: selectName,
                price: +select.value * count,
                count: count
            })
        })
    },
    addServices: function () {
        otherItemsPercent.forEach((item) => {
            const check = item.querySelector('input[type=checkbox')
            const label = item.querySelector('label')
            const input = item.querySelector('input[type=text]')
            if (check.checked) {
                this.servicesPercent[label.textContent] = +input.value
            }
        })
        otherItemsNumber.forEach((item) => {
            const check = item.querySelector('input[type=checkbox')
            const label = item.querySelector('label')
            const input = item.querySelector('input[type=text]')
            if (check.checked) {
                this.servicesNumber[label.textContent] = +input.value
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
    lockInputsAndSelects: function () {
        const elements = document.querySelectorAll('input[type=text], select, input[type="checkbox"]');
        elements.forEach(el => {
            el.disabled = true;
        });
    },
    unlockInputsAndSelects: function () {
        document.querySelectorAll('input[type=text], select, input[type="checkbox"]').forEach(el => {
            el.disabled = false;
        });
    },
    reset: function (hideCalculate = true) {
        if (hideCalculate) {
            startBtn.style.display = 'none';
            document.getElementById('reset').style.display = 'inline-block';
        } else {
            startBtn.style.display = 'inline-block';
            document.getElementById('reset').style.display = 'none';
            this.unlockInputsAndSelects();
            const elements = document.querySelectorAll('input[type=text], select');
            elements.forEach(el => {
                el.value = ''
            });
            const inputCheck = document.querySelectorAll('input[type="checkbox"]')
            inputCheck.forEach(el => {
                if (el.checked) {
                    el.checked = false
                }
            })
            inputRange.value = '0'
            span.textContent = '0' + '%'
        }
    },
    attachEventListeners: function () {
        screens.forEach(screen => {
            const select = screen.querySelector('select')
            const input = screen.querySelector('input')

            select.removeEventListener('change', this.checkFields)
            input.removeEventListener('input', this.checkFields)

            select.addEventListener('change', this.checkFields)
            input.addEventListener('input', this.checkFields)
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
        this.screens.forEach((screen) => totalScreenCount += screen.count)
        this.totalScreenCount = totalScreenCount

        this.screenPrice = 0
        for (let screen of this.screens) {
            this.screenPrice = this.screens.reduce((sum, screen) => sum + (+screen.price), 0)
        }
        for (let key in this.servicesNumber) {
            this.servicePricesNumber += this.servicesNumber[key]
        }
        for (let key in this.servicesPercent) {
            this.servicePricesPercent += this.screenPrice * (this.servicesPercent[key] / 100)
        }
        this.fullPrice = this.screenPrice + this.servicePricesPercent + this.servicePricesNumber
        const rollbackValue = +this.getRollback();
        this.totalCountWithRollback = this.fullPrice - (this.fullPrice * (rollbackValue / 100))
    },
    getSlider: function () {
        const mainControlsRollback = document.querySelector('.main-controls__item.rollback')
        const span = mainControlsRollback.querySelector('span')
        inputRange.addEventListener('input', () => {
            const value = inputRange.value
            this.rollback = value
            span.textContent = value + '%';
            this.addPrices();
            this.showResult();
        })
    },
    getRollback: function () {
        return +this.rollback;
    },
    logger: function () {
        console.log(this.fullPrice);
        console.log(this.servicePercentPrice);
        console.log(this.screens);
    }
}

appData.init();





