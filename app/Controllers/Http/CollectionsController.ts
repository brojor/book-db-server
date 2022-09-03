import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CollectionType from 'App/enums/CollectionType'
import Collection from 'App/Models/Collection'
import CollectionService from 'App/Services/CollectionService'
import BookToAddValidator from 'App/Validators/BookToAddValidator'

export default class CollectionsController {
  public async index({ params, auth }: HttpContextContract) {
    const collectionType = getCollectionType(params.collectionType)

    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    const collection = await Collection.firstOrCreate({
      userId: user.id,
      type: collectionType,
    })

    const books = await CollectionService.getBooks({ collection })
    const authors = await CollectionService.getAuthors({ collection })

    return {
      books,
      authors,
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ params, auth, request }: HttpContextContract) {
    const collectionType = getCollectionType(params.collectionType)

    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    const collection = await Collection.firstOrCreate({
      userId: user.id,
      type: collectionType,
    })

    const payload = await request.validate(BookToAddValidator)

    await CollectionService.addBook({ collection, book: payload })

    const books = await CollectionService.getBooks({ collection })
    const authors = await CollectionService.getAuthors({ collection })

    return {
      books,
      authors,
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}

function getCollectionType(paramString: string) {
  switch (paramString) {
    case 'wishlist':
      return CollectionType.WISHLIST
    case 'default':
      return CollectionType.DEFAULT
    default:
      throw new Error('Invalid collection type')
  }
}
