import Database from '@ioc:Adonis/Lucid/Database'
import Author from 'App/Models/Author'
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
      .select('books.author_id AS id', 'authors.full_name AS fullName')
      .count('books.author_id', 'numOfBooks')
      .from('book_collection')
      .join('books', 'book_collection.book_id', 'books.id')
      .join('authors', 'books.author_id', 'authors.id')
      .where('collection_id', collection.id)
      .groupBy('books.author_id', 'authors.full_name')
      .orderBy('authors.full_name')
  }

  public static async getBooks({ collection }: GetBooksOptions) {
    return (await collection.related('books').query().preload('author')).map((book) => ({
      ...book.serialize({ fields: { pick: ['id', 'title'] } }),
      ...{ author: book.author.serialize({ fields: { pick: ['id', 'fullName'] } }) },
    }))
  }

  public static async addBook({ collection, book }: AddBookOptions) {
    const { author, ...bookData } = book
    const dbAuthor = await Author.firstOrCreate({ fullName: author })

    await collection.related('books').create({ authorId: dbAuthor.id, ...bookData })
  }

  public static async removeBooks({ collection, bookIds }: BaseOptions & { bookIds: number[] }) {
    await collection.related('books').detach(bookIds)
  }

  public static async moveBooks({
    sourceCollection,
    targetCollection,
    bookIds,
  }: {
    sourceCollection: Collection
    targetCollection: Collection
    bookIds: number[]
  }) {
    await sourceCollection.related('books').detach(bookIds)
    await targetCollection.related('books').attach(bookIds)
  }
}
