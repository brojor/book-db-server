import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Author from './Author'
import Collection from './Collection'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public isbn: number

  @column()
  public title: string

  @column()
  public subtitle?: string

  @column()
  public pageCount?: number

  @column()
  public publisher?: string

  @column()
  public publishedDate?: string

  @column()
  public language?: string

  @column()
  public authorId: number

  @belongsTo(() => Author)
  public author: BelongsTo<typeof Author>

  @manyToMany(() => Collection, {
    pivotTimestamps: true,
    pivotColumns: ['book_state'],
  })
  public collections: ManyToMany<typeof Collection>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
