import { Tray, Menu, app } from 'electron'
import { WindowsManager } from '../windows'
import icon from '../../../resources/icon.png?asset'

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
      app.quit()
    }
  }
])

export default class AppTray {
  static instance: AppTray
  static getInstance() {
    if (!this.instance) {
      this.instance = new AppTray()
    }
    return this.instance
  }

  constructor() {}
  init = () => {
    const tray = new Tray(icon)
    tray.setToolTip('KunPan')
    tray.setContextMenu(contextMenu)
  }
}
