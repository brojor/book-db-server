import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('subtitle').nullable()
      table.bigInteger('isbn').nullable()
      table.integer('page_count').nullable()
      table.string('publisher').nullable()
      table.string('published_date').nullable()
      table.string('language').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('subtitle')
      table.dropColumn('isbn')
      table.dropColumn('page_count')
      table.dropColumn('publisher')
      table.dropColumn('published_date')
      table.dropColumn('language')
    })
  }
}
