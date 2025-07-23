import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity('PanFile')
export default class PanFile {
  // 主键 id
  @PrimaryColumn({ type: 'text', length: 255 })
  id: string = ''

  // 文件哈希
  @Column({ type: 'text', length: 255 })
  hash: string = ''

  // -1文件夹 0其他 1图片 2视频 3音频 4文档 5压缩包 创建索引
  @Index()
  @Column({ type: 'integer' })
  type: number = 0

  // 文件名
  @Column({ type: 'text', length: 255 })
  name: string = ''

  // 后缀格式
  @Column({ type: 'text', length: 10 })
  suffix: string = ''

  // 单位应该为 KB
  @Column({ type: 'integer', default: 0 })
  size: number = 0

  // 是否可见 -1回收站 0隐藏 1可见
  @Column({ type: 'integer', default: 1 })
  status: number = 1

  // 文件创建时间 单位应该为毫秒
  @Column({ type: 'integer', default: 0 })
  create: number = 0

  // 文件更新时间 单位应该为毫秒
  @Column({ type: 'integer', default: 0 })
  update: number = 0

  // 访问次数
  @Column({ type: 'integer', default: 0 })
  read: number = 0

  // 下载次数
  @Column({ type: 'integer', default: 0 })
  download: number = 0

  // 父目录
  @Index()
  @Column({ type: 'text', length: 255 })
  directory: string = ''

  // 网盘相对路径
  @Column({ type: 'text', length: 255 })
  path: string = ''
}
