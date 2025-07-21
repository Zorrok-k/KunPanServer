import { Tray, Menu, App } from 'electron'
import { WindowsManager } from './WindowsManager'
import icon from '../../../resources/icon.png?asset'

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

    this.tray.setToolTip('KunPan')
    this.tray.setContextMenu(contextMenu)
  }
}

export default AppTray
