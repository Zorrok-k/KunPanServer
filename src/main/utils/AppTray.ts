import { Tray, Menu, App } from 'electron'
import { WindowsManager } from './WindowsManager'
import icon from '../../../resources/icon.png?asset'
import { log } from 'node:console'

class AppTray {
  app: App
  tray = new Tray(icon)
  constructor(app: App) {
    this.app = app
  }
  init = () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '打开主窗口',
        click: () => {
          const window = WindowsManager.getInstance()
          console.log(window.windowsMap)
          window.getWindow(window.winModuleMap.get('main')!.id)?.show()
        }
      },
      {
        label: '退出',
        click: () => {
          this.app.quit()
        }
      }
    ])

    this.tray.setToolTip('My App')
    this.tray.setContextMenu(contextMenu)
  }
}

export default AppTray
