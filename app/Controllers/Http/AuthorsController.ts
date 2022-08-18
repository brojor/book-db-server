import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Collection from 'App/Models/Collection'
import { string } from '@ioc:Adonis/Core/Helpers'

function changeKeysToCamelCase(obj: { [key: string]: any }) {
  return Object.keys(obj).reduce((newObj, key) => {
    newObj[string.camelCase(key)] = obj[key]
    return newObj
  }, {} as { [key: string]: any })
}

export default class AuthorsController {
  public async index({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    const userCollection = await Collection.firstOrCreate({ userId: user.id, name: 'default' })

    const { rows } = await Database.rawQuery(
      `
      SELECT books.author_id AS id, authors.first_name, authors.last_name, COUNT(books.author_id) AS num_of_books
      FROM book_collection
      JOIN books ON book_collection.book_id = books.id
      JOIN authors ON books.author_id = authors.id
      WHERE collection_id = ?
      GROUP BY books.author_id, authors.first_name, authors.last_name
      ORDER BY authors.first_name
    `,
      [userCollection.id]
    )

    return rows.map((book) => changeKeysToCamelCase(book))
  }
}
