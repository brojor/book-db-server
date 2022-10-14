import Database from '@ioc:Adonis/Lucid/Database'
import Author from 'App/Models/Author'
import Collection from 'App/Models/Collection'
import BookState from 'App/Enums/BookState'
import Book from 'App/Models/Book'

interface BaseOptions {
  collection: Collection
}

// interface GetBooksOptions extends BaseOptions {
//   authorId?: number
// }

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
  bookState: BookState
}

export default class CollectionService {
  public static getAuthors({ collection, bookState }: BaseOptions & { bookState?: BookState }) {
    return Database.query()
      .select('books.author_id AS id', 'authors.full_name AS fullName')
      .count('books.author_id', 'numOfBooks')
      .from('book_collection')
      .join('books', 'book_collection.book_id', 'books.id')
      .join('authors', 'books.author_id', 'authors.id')
      .where((builder) => {
        builder.where('collection_id', collection.id)
        if (bookState) {
          builder.where('book_state', bookState)
        } else {
          builder.whereNot('book_state', BookState.wishlist)
        }
      })
      .groupBy('books.author_id', 'authors.full_name')
      .orderBy('authors.full_name')
  }

  public static async getBooks({ collection, bookState }: BaseOptions & { bookState?: BookState }) {
    const books = await Database.query()
      .select(
        'books.id',
        'book_state AS bookState',
        'authors.id as authorId',
        'books.title as title',
        'books.subtitle as subtitle',
        'books.page_count AS pageCount',
        'books.published_date AS publishedDate'
      )
      .from('book_collection')
      .join('books', 'book_collection.book_id', 'books.id')
      .join('authors', 'books.author_id', 'authors.id')
      .where((builder) => {
        builder.where('collection_id', collection.id)
        if (bookState) {
          builder.where('book_state', bookState)
        } else {
          builder.whereNot('book_state', BookState.wishlist)
        }
      })
      .orderBy('books.title')
    return await Promise.all(
      books.map(async (book) => {
        const author = (await Author.findOrFail(book.authorId)).serialize({
          fields: {
            pick: ['id', 'fullName'],
          },
        })
        return {
          ...book,
          authorId: undefined,
          author,
        }
      })
    )
  }

  public static async addBook({ collection, book, bookState }: AddBookOptions) {
    const { author, ...bookData } = book
    const dbAuthor = await Author.firstOrCreate({ fullName: author })
    // TODO: check if book already exists
    // const dbBook = await Book.firstOrCreate({ authorId: dbAuthor.id, isbn? or something similar })
    const dbBook = await Book.create({ authorId: dbAuthor.id, ...bookData })

    await collection.related('books').attach({ [dbBook.id]: { book_state: bookState } })
  }

  public static async removeBooks({ collection, bookIds }: BaseOptions & { bookIds: number[] }) {
    await collection.related('books').detach(bookIds)
  }

  public static setBookState({
    collection,
    bookIds,
    bookState,
  }: BaseOptions & { bookIds: number[]; bookState: BookState }) {
    return collection.related('books').pivotQuery().whereIn('book_id', bookIds).update({ book_state: bookState })
  }
}
