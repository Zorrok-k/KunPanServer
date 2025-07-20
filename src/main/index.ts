import { app, ipcMain } from 'electron'
import { WindowsManager } from './utils/WindowsManager'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import expServer from '../server/index'
import AppTray from './utils/appTray'

// 当 Electron 初始化完成并准备好创建浏览器窗口时调用
app.whenReady().then(() => {
  // 为 Windows 设置应用程序用户模型 ID
  electronApp.setAppUserModelId('com.electron')

  // 开发环境下默认通过 F12 打开/关闭开发者工具
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 主进程
  WindowsManager.getInstance().newWindow({
    name: 'main',
    url: '#/home',
    width: 1280,
    height: 720,
    center: true
  })
  expServer.start()

  ipcMain.handle('window-close', (_e, id) => {
    console.log(id)
    WindowsManager.getInstance().getWindow(id)!.hide()
    new AppTray(app).init()
  })
})

// 所有窗口关闭时退出程序
app.on('window-all-closed', () => {
  app.quit()
})
