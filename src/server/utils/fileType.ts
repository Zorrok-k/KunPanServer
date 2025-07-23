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

    const { mime } = result

    // 1. 图片
    if (mime.startsWith('image/')) return 1

    // 2. 视频
    if (mime.startsWith('video/')) return 2

    // 3. 音频
    if (mime.startsWith('audio/')) return 3

    // 4. 文档
    const documentMimes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'text/plain', // .txt
      'application/vnd.oasis.opendocument.text', // .odt
      'application/rtf' // .rtf
    ]
    if (documentMimes.includes(mime)) return 4

    // 5. 压缩包
    const archiveMimes = [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/x-gzip'
    ]
    if (archiveMimes.includes(mime)) return 5

    // 未知类型
    return 0
  } catch (error) {
    return 0
  }
}
