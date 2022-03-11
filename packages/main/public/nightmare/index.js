/* eslint-disable @typescript-eslint/no-var-requires */
const Nightmare = require('nightmare')
const nightmare = new Nightmare({
    show: true,
    openDevTools: {
        mode: 'detach',
    },
})
nightmare.goto('https://www.hujiang.com')
    .evaluate(function () {
        // 该环境中能使用浏览器中的任何对象window/document，并且返回一个promise
        console.log('hello nightmare')
        console.log('5 second close window')
    })
    .wait(5000)
    .end()
    .then(() => {
        console.log('close nightmare')
    })
