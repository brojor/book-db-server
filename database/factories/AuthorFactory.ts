import Author from 'App/Models/Author'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Author, ({ faker }) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  }
}).build()
