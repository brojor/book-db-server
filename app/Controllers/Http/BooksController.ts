import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Author from 'App/Models/Author'
import Book from 'App/Models/Book'
import Collection from 'App/Models/Collection'
import Database from '@ioc:Adonis/Lucid/Database'

export default class BooksController {
  public async index({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    const userCollection = await Collection.query()
      .where({ userId: user.id, name: 'default' })
      .firstOrFail()

    const { rows } = await Database.rawQuery(
      `
    SELECT CONCAT(authors.first_name, ' ', authors.last_name) as author_name, authors.id as author_id,
    books.id, books.title, book_collection.created_at
    FROM book_collection
    JOIN books ON book_collection.book_id = books.id
    JOIN authors ON books.author_id = authors.id
    WHERE collection_id = ?
    `,
      [userCollection.id]
    )

    return rows
  }

  public async store({ request, auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    const {
      author,
      title,
      collection: collectionName = 'default',
    } = request.only(['author', 'title', 'collection'])

    const dbAuthor = await Author.firstOrCreate({
      firstName: author.firstName,
      lastName: author.lastName,
    })

    const book = await Book.firstOrCreate({ title, authorId: dbAuthor.id })

    const userCollection = await Collection.firstOrCreate({ userId: user.id, name: collectionName })

    await userCollection.related('books').save(book)

    return { title: book.title, author: `${dbAuthor.firstName} ${dbAuthor.lastName}` }
  }
}
