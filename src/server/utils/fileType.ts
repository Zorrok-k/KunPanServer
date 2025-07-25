import { fileTypeFromFile } from 'file-type'

/**
 * 根据文件路径返回文件类型编号
 * @param path 文件路径（必须是文件，非文件夹）
 * @returns Promise<number> 0=其他 1=图片 2=视频 3=音频 4=文档 5=压缩包
 */
export async function getTypeNum(path: string): Promise<number> {
  try {
    const result = await fileTypeFromFile(path)
    if (!result) return 0

    let mime = result.mime.toLowerCase().trim()

    // 去除 MIME 中的参数（如 ;charset=binary, ; boundary=...）
    mime = mime.split(';')[0].trim()

    // 1. 图片
    if (mime.startsWith('image/')) return 1

    // 2. 视频
    if (mime.startsWith('video/')) return 2

    // 3. 音频
    if (mime.startsWith('audio/')) return 3

    // 4. 文档
    const documentMimes = new Set([
      'application/pdf',

      // Microsoft Office 新格式（OpenXML）
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx

      // Microsoft Office 旧格式（CFB 格式）
      'application/x-cfb', // 用于 .doc, .xls, .ppt 等 CFB 格式的文件

      // Microsoft Office 宏启用文件
      'application/vnd.ms-word.document.macroenabled.12', // .docm
      'application/vnd.ms-excel.sheet.macroenabled.12', // .xlsm
      'application/vnd.ms-powerpoint.slideshow.macroenabled.12', // .ppsm
      'application/vnd.ms-powerpoint.presentation.macroenabled.12', // .pptm

      // OpenDocument 格式
      'application/vnd.oasis.opendocument.text', // .odt
      'application/vnd.oasis.opendocument.text-template', // .ott
      'application/vnd.oasis.opendocument.spreadsheet', // .ods
      'application/vnd.oasis.opendocument.spreadsheet-template', // .ots
      'application/vnd.oasis.opendocument.presentation', // .odp
      'application/vnd.oasis.opendocument.presentation-template', // .otp
      'application/vnd.oasis.opendocument.graphics', // .odg
      'application/vnd.oasis.opendocument.graphics-template', // .otg

      // 文本与富文本
      'text/plain', // .txt
      'application/rtf', // .rtf

      // ePub 电子书
      'application/epub+zip',

      // Visio
      'application/vnd.visio', // .vsdx

      // 3D 模型
      'model/3mf' // .3mf
    ])

    if (documentMimes.has(mime)) return 4

    // 5. 压缩包
    const archiveMimes = new Set([
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/x-gzip',
      'application/gzip'
    ])

    if (archiveMimes.has(mime)) return 5

    // 其他未识别类型
    return 0
  } catch (error) {
    console.warn(`[getTypeNum] 文件类型检测失败: ${path}`, error)
    return 0
  }
}
