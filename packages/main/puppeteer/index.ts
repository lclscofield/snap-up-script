import { ipcMain } from 'electron'
import { Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

// 默认配置
const defaultConfig = {
    headless: false, // 有头模式
    defaultViewport: null, // 视图撑满
    slowMo: 100,
    devtools: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-extensions-except=C:\\Users\\lclsc\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\mopnmbcafieddcagagdcbnhejhlodfdd\\0.42.2_0'],
}

// 使用隐藏插件
puppeteer.use(StealthPlugin())

// 等待函数
function sleep (delay: number | undefined = 100): Promise<unknown> {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

// dot 插件页面
let pageDot: Page
// fxdx 页面
// let pageFxdx: Page

export default () => {
    // 创建主钱包，返回助记词
    ipcMain.handle('createMainWallet', async (): Promise<unknown> => {
        try {
            const browser = await puppeteer.launch({
                ...defaultConfig,
            })
            pageDot = await browser.newPage()
            // 打开 dot 插件
            await pageDot.goto('chrome-extension://mopnmbcafieddcagagdcbnhejhlodfdd/index.html#/')

            // 点击继续按钮进入钱包
            await pageDot.click('.Button-sc-1gyneog-0')

            // 点击设置
            await pageDot.click('.popupMenus .popupToggle:nth-child(2)')

            // 选择汉语
            await pageDot.select('.gRyYwo .setting:nth-child(3) select', 'zh')

            // 点击 + 号
            await pageDot.click('.popupMenus .popupToggle:nth-child(1)')

            // 点击创建
            await pageDot.click('a[href="#/account/create"]')

            // 保存助记词，进入第二步
            const key = await pageDot.$eval('.ikunKS', (textarea) => {
                return textarea.innerHTML
            })
            await pageDot.click('.eQXBrs label')
            await pageDot.click('.jECBwC')
            // const key = await pageDot.evaluate((textarea, input, btn) => {
            //     const key = textarea.value
            //     input.click()
            //     btn.click()
            //     return key
            // }, await pageDot.$('.TextInputs__TextArea-sc-199o3xu-0'), await pageDot.$('.eQXBrs label'), await pageDot.$('.jECBwC'))

            // 输入账号密码，完成账号创建
            await pageDot.type('.dGCWLT[type="text"]', '主钱包')
            await pageDot.type('.dGCWLT[type="password"]', '123456')
            await pageDot.type('.kGNBlT div:nth-child(6) .dGCWLT[type="password"]', '123456')
            await pageDot.click('.gwzpcW')

            return key
        } catch (error) {
            return error
        }
    })
}
