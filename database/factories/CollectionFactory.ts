import Collection from 'App/Models/Collection'
import Factory from '@ioc:Adonis/Lucid/Factory'
import CollectionType from 'App/enums/CollectionType'
import BookFactory from './BookFactory'

export default Factory.define(Collection, ({ faker }) => {
  return {
    type: CollectionType.DEFAULT,
    userId: 1,
  }
})
  .state('wishlist', (collection) => (collection.type = CollectionType.WISHLIST))
  .relation('books', () => BookFactory)
  .build()
