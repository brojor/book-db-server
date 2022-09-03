import Database from '@ioc:Adonis/Lucid/Database'
import Author from 'App/Models/Author'
import Book from 'App/Models/Book'
import Collection from 'App/Models/Collection'

interface BaseOptions {
  collection: Collection
}

interface GetBooksOptions extends BaseOptions {
  authorId?: number
}

interface BookToAdd {
  author: string
  title: string
  subtitle?: string
  pageCount?: number
  publisher?: string
  publishedDate?: string
  language?: string
}

interface AddBookOptions extends BaseOptions {
  book: BookToAdd
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

  public static async addBook({ collection, book }: AddBookOptions) {
    const { author, ...bookData } = book
    const [firstName, lastName] = author.split(' ') // TODO: change author db model and migration to use FullName instead of firstName and lastName OR use middleName
    const dbAuthor = await Author.firstOrCreate({ firstName, lastName })

    await collection.related('books').create({ authorId: dbAuthor.id, ...bookData })
  }
}
