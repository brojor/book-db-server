import Database from '@ioc:Adonis/Lucid/Database'
import Author from 'App/Models/Author'
import Collection from 'App/Models/Collection'

interface BaseOptions {
  collection: Collection
}

interface GetBooksOptions extends BaseOptions {
  authorId?: number
}

interface AddBookOptions extends BaseOptions {
  author: {
    firstName: string
    lastName: string
  }
  title: string
}

export default class CollectionService {
  public static getAuthors({ collection }: BaseOptions) {
    return Database.query()
      .select(
        'books.author_id AS id',
        'authors.first_name AS firstName',
        'authors.last_name AS lastName'
      )
      .count('books.author_id', 'numOfBooks')
      .from('book_collection')
      .join('books', 'book_collection.book_id', 'books.id')
      .join('authors', 'books.author_id', 'authors.id')
      .where('collection_id', collection.id)
      .groupBy('books.author_id', 'authors.first_name', 'authors.last_name')
      .orderBy('authors.first_name')
  }

  public static async getBooks({ collection, authorId }: GetBooksOptions) {
    const baseQuery = collection.related('books').query().preload('author')
    const query = await (authorId ? baseQuery.where('authorId', authorId) : baseQuery).orderBy(
      'title'
    )

    return query.map((book) => ({
      ...book.serialize({ fields: { pick: ['id', 'title'] } }),
      ...{ author: book.author.serialize({ fields: { pick: ['id', 'fullName'] } }) },
    }))
  }

  public static async addBook({ collection, author, title }: AddBookOptions) {
    const dbAuthor = await Author.firstOrCreate({
      firstName: author.firstName,
      lastName: author.lastName,
    })

    await collection.related('books').create({ title, authorId: dbAuthor.id })
  }
}
