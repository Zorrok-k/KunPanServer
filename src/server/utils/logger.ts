import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  // 日志级别，只输出 info 及以上级别的日志
  level: 'info',
  // 日志格式为 JSON
  format: format.combine(
    format.errors({ stack: true }), // 添加错误堆栈信息
    format.json()
  ),
  // 添加元数据，这里添加了服务名称
  // defaultMeta: { service: 'Electron' },
  // 日志输出位置
  transports: [
    // 将 error 或更高级别的错误写入 error.log 文件
    new transports.File({ filename: '../../resources/logs/error.log', level: 'error' }),
    // 将 info 或更高级别的日志写入 combined.log 文件
    new transports.File({ filename: '../../resources/logs/combined.log' })
  ]
})

// 在非生产环境下，将日志输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        // 终端中输出彩色的日志信息
        format.colorize(),
        format.simple()
      )
    })
  )
}

export default logger
