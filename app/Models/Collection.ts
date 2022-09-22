import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Book from './Book'
import CollectionType from 'App/enums/CollectionType'

export default class Collection extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: CollectionType

  @column()
  public userId: number

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>

  @manyToMany(() => Book, {
    pivotTimestamps: true,
    pivotColumns: ['read_status'],
  })
  public books: ManyToMany<typeof Book>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
