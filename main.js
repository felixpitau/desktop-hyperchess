import { app, BrowserWindow } from 'electron'
import electronReload from 'electron-reload'
import path from 'path'

let win = null
electronReload(__dirname)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  win = new BrowserWindow({width: 1200, height: 600, frame: false})
  win.loadURL(path.join('file://', __dirname, '/app/index.html'))
  win.setMenu(null)
  win.toggleDevTools()
  win.on('closed', () => {
    win = null
  })
})
