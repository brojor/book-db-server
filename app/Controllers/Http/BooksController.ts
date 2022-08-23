import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CollectionType from 'App/enums/CollectionType'
import Collection from 'App/Models/Collection'
import CollectionService from 'App/Services/CollectionService'

export default class BooksController {
  public async index({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    const collection = await Collection.firstOrCreate({
      userId: user.id,
      type: CollectionType.DEFAULT,
    })

    return await CollectionService.getBooks({ collection })
  }

  public async store({ request, auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    const { author, title } = request.only(['author', 'title'])

    const collection = await Collection.firstOrCreate({
      userId: user.id,
      type: CollectionType.DEFAULT,
    })

    await CollectionService.addBook({ collection, author, title })

    const books = await CollectionService.getBooks({ collection })
    const authors = await CollectionService.getAuthors({ collection })

    return {
      books,
      authors,
    }
  }
}
