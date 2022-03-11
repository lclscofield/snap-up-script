import { ipcMain } from 'electron'
import { spawn } from 'child_process'
import path from 'path'

export default () => {
    ipcMain.handle('nightmare', async () => {
        // const childProcess = await spawn(`node ${path.resolve(__dirname, './nightmare/index.js')}`)
        const childProcess = await spawn('node', ['index.js'], {
            // stdio: 'inherit',
            cwd: path.resolve(__dirname, './nightmare'),
        })
        // const childProcess = await exec('node ./nightmare/index.js')
        console.log(childProcess)
    })
}
