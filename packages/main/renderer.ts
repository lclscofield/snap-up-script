import { ipcMain } from 'electron'
import { fork } from 'child_process'
import path from 'path'

export default () => {
    ipcMain.handle('nightmare', async () => {
        // const childProcess = await spawn(`node ${path.resolve(__dirname, './nightmare/index.js')}`)
        // await spawn('node', ['index.js'], {
        //     // stdio: 'inherit',
        //     cwd: path.resolve(__dirname, './nightmare'),
        // })
        // const childProcess = await exec('node ./nightmare/index.js')
        // console.log(childProcess)
        const cp = await fork('index.js', {
            cwd: path.resolve(__dirname, './nightmare'),
        })
        cp.on('message', (m) => {
            console.log('PARENT got message:', m)
        })
        cp.send({ hello: 'world' })
    })
}
