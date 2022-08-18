import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import BookCollection from 'App/Models/BookCollection'
import Collection from 'App/Models/Collection'

export default class AuthorsController {
  public async index({ request, auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    const userCollection = await Collection.firstOrCreate({ userId: user.id, name: 'default' })

    const { rows } = await Database.rawQuery(
      `
      SELECT books.author_id, CONCAT(authors.first_name, ' ', authors.last_name) AS author, COUNT(books.author_id)
      FROM book_collection
      JOIN books ON book_collection.book_id = books.id
      JOIN authors ON books.author_id = authors.id
      WHERE collection_id = ?
      GROUP BY books.author_id, authors.first_name, authors.last_name
    `,
      [userCollection.id]
    )

    return rows
  }
}
