import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CollectionType from 'App/enums/CollectionType'
import Collection from 'App/Models/Collection'
import CollectionService from 'App/Services/CollectionService'
import books from '../../books'

export default class extends BaseSeeder {
  public async run() {
    //   await CollectionFactory.with('books', 40).create()
    //   await CollectionFactory.apply('wishlist').with('books', 10).create()

    const defaultCollection = await Collection.create({
      type: CollectionType.DEFAULT,
    })
    const wishlistCollection = await Collection.create({
      type: CollectionType.WISHLIST,
    })

    for (const [i, book] of books.entries()) {
      if (i % 8 === 0) {
        await CollectionService.addBook({
          collection: wishlistCollection,
          book: {
            author: `${book.author_first_name} ${book.author_last_name}`,
            title: book.title,
          },
        })
      } else {
        await CollectionService.addBook({
          collection: defaultCollection,
          book: {
            author: `${book.author_first_name} ${book.author_last_name}`,
            title: book.title,
          },
        })
      }
    }
  }
}
