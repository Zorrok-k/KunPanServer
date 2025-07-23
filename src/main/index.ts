import { app, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { WindowsManager } from './windows/index'
import windows from './windows/options'
import Settings from './settings'
import Server from '../server/index'
import AppTray from './utils/AppTray'

// 当 Electron 初始化完成并准备好创建浏览器窗口时调用
app.whenReady().then(async () => {
  // 为 Windows 设置应用程序用户模型 ID
  electronApp.setAppUserModelId('com.electron')

  // 开发环境下默认通过 F12 打开 / 关闭开发者工具
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 创建主窗口
  WindowsManager.getInstance().newWindow(windows.main)
  // 创建系统托盘
  AppTray.getInstance().init()
  // 读取配置文件
  await Settings.getInstance().init()
  // 启动 Express 服务端
  Server.getInstance().start()
  // 注册 ipc 监听 待整理
  ipcMain.handle('window-close', (_e, id) => {
    WindowsManager.getInstance().getWindow(id)!.hide()
  })
})

// 所有窗口关闭时退出程序
app.on('window-all-closed', () => {
  app.quit()
})
