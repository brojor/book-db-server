import Collection from 'App/Models/Collection'
import Factory from '@ioc:Adonis/Lucid/Factory'
import BookFactory from './BookFactory'

export default Factory.define(Collection, () => {
  return {
    type: 1,
    userId: 1,
  }
})
  .relation('books', () => BookFactory)
  .build()
