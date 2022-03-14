import { dialog, ipcMain } from 'electron'
import readline from 'readline'
import fs from 'fs'
import { Browser } from 'puppeteer'
// import puppeteer from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

// 默认配置
const defaultConfig = {
    headless: false, // 有头模式
    defaultViewport: null, // 视图撑满
}

// 使用隐藏插件
puppeteer.use(StealthPlugin())

// 浏览器列表
let browserList: { browser: Browser; browserWSEndpoint: string }[] = []

export default () => {
    // 上传账号文件
    ipcMain.handle('upload', async () => {
        const files = dialog.showOpenDialogSync({
            filters: [{
                name: 'TXT',
                extensions: ['txt'],
            }],
        })
        if (!files || files[0]) return null

        // 逐行读取 txt 文件
        const rl = readline.createInterface({
            input: fs.createReadStream(files[0]),
            output: process.stdout,
            terminal: false,
        })
        const lines = []
        rl.on('line', (line) => {
            console.log(line)
            lines.push(line.split(','))
        })
    })
    ipcMain.handle('openBrowser', async () => {
        for (let i = 0; i < 1; i++) {
            const browser = await puppeteer.launch({
                ...defaultConfig,
            })
            // 浏览器 ws 地址
            const browserWSEndpoint = browser.wsEndpoint()
            // 监听浏览器断开连接
            // browser.on('disconnected', () => {})
            const page = await browser.newPage()
            await page.goto('https://bot.sannysoft.com/')
            browserList.push({
                browser,
                browserWSEndpoint,
            })
        }
    })
    ipcMain.handle('closeBrowser', async () => {
        browserList.forEach(browserObj => {
            browserObj.browser.close()
        })
        browserList = []
    })
}
