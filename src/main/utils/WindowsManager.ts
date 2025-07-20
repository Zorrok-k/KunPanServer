import { BrowserWindow, ipcMain, shell } from 'electron'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'
import { join } from 'path'

export type winOptions = {
  /**
   * Electron 窗口配置选项
   *
   * name: 窗口模块名称（如 "login", "settings"），用于标识不同功能的窗口。
   * center: 是否在屏幕中心显示窗口，默认为 false。
   * url: 窗口加载的 URL 或路径，开发环境加载远程 URL，生产环境加载本地 HTML 文件。
   * width: 窗口的宽度（单位：像素），可选。
   * height: 窗口的高度（单位：像素），可选。
   * maximizable: 是否允许最大化按钮，默认为 true。
   * resizable: 是否允许调整窗口大小，默认为 true。
   * alwaysOnTop: 窗口是否始终置顶，默认为 false。
   */

  name: string
  url: string
  width?: number
  height?: number
  center?: boolean
  maximizable?: boolean
  resizable?: boolean
  alwaysOnTop?: boolean
}

// 传给前端的窗口信息
export type winModule = {
  id: number
  url: string
}

export class WindowsManager {
  // 已创建的窗口实体集合
  windowsMap = new Map<number, BrowserWindow>()
  // 传给前端的窗口信息集合
  winModuleMap = new Map<string, winModule>()

  static instance: WindowsManager
  static getInstance() {
    if (!this.instance) {
      this.instance = new WindowsManager()
    }
    return this.instance
  }

  // 当前上下文的新建窗口对象 和 构建信息
  window: any
  options: any

  // 构造函数 用来注册handle
  constructor() {
    // 发送窗口信息
    ipcMain.handle('get-win-info', () => {
      const info = {
        id: this.window.id,
        name: this.options.name
      }
      return info
    })
    // 等待渲染进程加载完毕
    ipcMain.handle('renderer-ready', () => {
      console.log('[主进程] 渲染进程加载完毕，窗口显示')
      // 如果是开发环境打开开发者工具
      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        this.window.webContents.openDevTools({ mode: 'undocked' })
      }
      this.window.show()
    })
  }

  newWindow = (options: winOptions): BrowserWindow => {
    this.options = options
    // 如果窗口实体已创建则显示在前台
    if (this.winModuleMap.has(options.name)) {
      const win = this.windowsMap.get(this.winModuleMap.get(options.name)!.id)
      win!.focus()
      return win!
    }
    // 开始创建窗口
    const width = options.width || 1100
    const height = options.height || 790
    const resizable = options.resizable || false
    const maximizable = options.maximizable || true
    const currentWindow = BrowserWindow.getFocusedWindow()
    let coord: { x: number | undefined; y: number | undefined } = { x: undefined, y: undefined }
    //如果已经有打开的窗口，并且新窗口不是居于屏幕中央，则相对于上一个窗口进行偏移
    if (currentWindow && !options.center) {
      const [currentWindowX, currentWindowY] = currentWindow.getPosition()
      coord.x = currentWindowX + 30
      coord.y = currentWindowY + 30
    }
    const window = new BrowserWindow({
      icon: icon,
      show: false,
      frame: false,
      transparent: true,
      ...coord,
      alwaysOnTop: options.alwaysOnTop,
      center: options.center,
      width: width,
      height: height,
      resizable: resizable,
      maximizable: maximizable,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: false,
        sandbox: false
      }
    })

    this.window = window

    // 窗口生命周期
    window.on('ready-to-show', () => {
      console.log('[主进程] 窗口已准备好显示')
    })

    window.on('close', () => {
      ipcMain.removeHandler('winInfo')
      ipcMain.removeHandler('rendererReady')
    })

    // 设置新窗口打开时的行为，使用默认浏览器打开外部链接
    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // 根据环境设置路由地址
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'] + options.url)
    } else {
      //打包后读取文件，并使用哈希打开指定路由
      window.loadFile(join(__dirname, '../renderer/index.html'), {
        hash: options.url
      })
    }

    //将窗口信息存储到map
    this.windowsMap.set(window.id, window)
    this.winModuleMap.set(options.name, { id: window.id, url: options.url || '' })

    return window
  }

  getWindow = (id: number) => {
    return this.windowsMap.get(id)
  }

  deleteWindow = (id: number) => {
    const win = this.windowsMap.get(id)
    try {
      if (this.windowsMap.size > 1) {
        let key = ''
        this.winModuleMap.forEach((item, k) => {
          if (item.id === id) {
            key = k
          }
        })
        if (key !== '') {
          this.winModuleMap.delete(key)
        }
        this.windowsMap.delete(id)
      }
      win?.close()
    } catch (error) {}
  }
}
