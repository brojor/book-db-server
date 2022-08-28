import Book from 'App/Models/Book'
import Factory from '@ioc:Adonis/Lucid/Factory'
import AuthorFactory from './AuthorFactory'

export default Factory.define(Book, async ({ faker }) => {
  const author = await AuthorFactory.create()
  const words = faker.random.words()
  return {
    title: words.charAt(0).toUpperCase() + words.slice(1).toLowerCase(),
    authorId: author.id,
  }
}).build()
