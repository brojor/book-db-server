import Author from 'App/Models/Author'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Author, ({ faker }) => {
  return { fullName: faker.name.fullName() }
}).build()
