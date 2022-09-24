import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import BookState from 'App/enums/BookState'

export default class extends BaseSchema {
  protected tableName = 'book_collection'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('collection_id').unsigned().references('id').inTable('collections').onDelete('CASCADE')
      table.integer('book_id').unsigned().references('id').inTable('books').onDelete('CASCADE')
      table.integer('book_state').unsigned().defaultTo(BookState.unread)
      table.unique(['collection_id', 'book_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
