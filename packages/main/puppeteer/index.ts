import { ipcMain } from 'electron'
import puppeteer from 'puppeteer'

export default () => {
    ipcMain.handle('puppeteer', async () => {
        const browserList = []
        for (let i = 0; i < 50; i++) {
            const browser = await puppeteer.launch({
                // headless: false, // 有头模式
            })
            const page = await browser.newPage()
            await page.goto('https://baidu.com')
            browserList.push(browser)
        }

        // await browser.close()
    })
}
