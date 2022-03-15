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
const browserList: { browser: Browser; browserWSEndpoint: string }[] = []

export default () => {
    // 上传账号文件
    ipcMain.handle('upload', async (): Promise<string[][] | null> => {
        const files = dialog.showOpenDialogSync({
            filters: [{
                name: 'TXT',
                extensions: ['txt'],
            }],
        })
        if (!files || !files[0]) return null

        // 逐行读取 txt 文件
        const rl = readline.createInterface({
            input: fs.createReadStream(files[0]),
            output: process.stdout,
            terminal: false,
        })
        const lines = []
        // 同步方式，读取每一行的内容
        for await (const line of rl) {
            lines.push(line.split(','))
        }
        return lines
    })
    // 打开浏览器
    ipcMain.handle('openBrowser', async (event, num = 1): Promise<unknown> => {
        try {
            for (let i = 0; i < num; i++) {
                // 打开浏览器
                const browser = await puppeteer.launch({
                    ...defaultConfig,
                })
                // 浏览器 ws 地址
                const browserWSEndpoint = browser.wsEndpoint()

                // 保存浏览器实例
                browserList.push({
                    browser,
                    browserWSEndpoint,
                })
                // 监听浏览器断开连接
                // browser.on('disconnected', () => {})
                // 打开页面
                const page = await browser.newPage()
                await page.goto('https://bot.sannysoft.com/')
            }
        } catch (error) {
            return error
        }
    })
    // 关闭浏览器
    ipcMain.handle('closeBrowser', async (event, index = -1): Promise<void> => {
        // -1 关闭所有浏览器
        if (index === -1) {
            browserList.forEach(browserObj => {
                browserObj.browser.close()
            })
            browserList.splice(0, browserList.length)
        } else if (index >= 0) {
            browserList[index].browser.close()
            browserList.splice(index, 1)
        }
    })
}
