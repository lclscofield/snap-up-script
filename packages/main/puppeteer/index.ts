import { ipcMain } from 'electron'
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

interface IUser {
    username: string,
    password: string
}

// 等待函数
function delay (time: number): Promise<unknown> {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

export default () => {
    // 打开浏览器
    ipcMain.handle('openBrowser', async (event, user: string): Promise<unknown> => {
        try {
            console.log(user)
            // 打开浏览器
            const browser = await puppeteer.launch({
                ...defaultConfig,
            })
            // 创建页面
            const page = await browser.newPage()

            // 拦截请求
            await page.setRequestInterception(true)

            const userObj: IUser = JSON.parse(user)
            page.on('request', interceptedRequest => {
                // 拦截登录请求，写入登录数据
                if (interceptedRequest.url().endsWith('checkLogin')) {
                    interceptedRequest.continue({
                        postData: `loginName=${userObj.username}&loginPwd=${userObj.password}`,
                    })
                }
                interceptedRequest.continue()
            })
            // 进入页面
            await page.goto('https://www.jiaoxingji.com/h5/#/')

            // 点击登录后跳转页面
            await Promise.all([
                page.waitForNavigation(),
                page.evaluate(b => {
                    b.click()
                }, await page.$('uni-button')),
            ])

            // 点击导航 “竞抢”
            await Promise.all([
                page.waitForNavigation(),
                page.evaluate(b => {
                    b.click()
                }, await page.$('.uni-tabbar div:nth-child(3)')),
            ])

            // 等待 3s 开始循环点击抢购
            await delay(3000)

            // 循环点击抢购按钮
            let n = 0
            const timer = setInterval(async () => {
                n++
                try {
                    await page.evaluate((b, n) => {
                        console.log(`点击第${n}次`)
                        b.click()
                    }, await page.$('.Grab'), n)
                } catch (error) {
                    console.log(error)
                    clearInterval(timer)
                }
            }, 10)
        } catch (error) {
            return error
        }
    })
}
