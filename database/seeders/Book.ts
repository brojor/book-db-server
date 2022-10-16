import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import CollectionService from 'App/Services/CollectionService'
import books from '../../top12Wezeo.json'
import Env from '@ioc:Adonis/Core/Env'

export default class extends BaseSeeder {
  public async run() {
    const user = await User.create({ email: 'john@doe.com', password: Env.get('JOHN_DOE_PASSWORD') })
    const defaultCollection = await user.related('collections').create({ type: 1 })

    for (const book of books) {
      await CollectionService.addBook({
        collection: defaultCollection,
        book,
        bookState: getRandomNumber(1, 4),
      })
    }
  }
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
