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

  public async markAsRead({ auth, request, params }: HttpContextContract) {
    const user = await auth.use('api').authenticate()
    const collectionType = getCollectionType(params.collectionType)
    const { bookIds } = request.body()
    const { readStatus } = request.qs()

    const collection = await Collection.firstOrCreate({
      userId: user.id,
      type: collectionType,
    })

    await CollectionService.setReadStatus({ collection, bookIds, readStatus })

    const books = await CollectionService.getBooks({ collection })
    const authors = await CollectionService.getAuthors({ collection })

    return {
      books,
      authors,
    }
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const user = await auth.use('api').authenticate()

    const sourceCollectionType = getCollectionType(params.collectionType)
    const targetCollectionType = getCollectionType(request.qs().target)
    const { bookIds } = request.body()

    const sourceCollection = await Collection.query()
      .where('userId', user.id)
      .where('type', sourceCollectionType)
      .firstOrFail()
    const targetCollection = await Collection.firstOrCreate({
      userId: user.id,
      type: targetCollectionType,
    })

    await CollectionService.moveBooks({ sourceCollection, targetCollection, bookIds })

    return {
      sourceCollection: {
        books: await CollectionService.getBooks({ collection: sourceCollection }),
        authors: await CollectionService.getAuthors({ collection: sourceCollection }),
      },
      targetCollection: {
        books: await CollectionService.getBooks({ collection: targetCollection }),
        authors: await CollectionService.getAuthors({ collection: targetCollection }),
      },
    }
  }

  public async destroy({ auth, request, params }: HttpContextContract) {
    const collectionType = getCollectionType(params.collectionType)
    await auth.use('api').authenticate()
    const user = auth.use('api').user!
    const { bookIds } = request.body()

    const collection = await Collection.query()
      .where('userId', user.id)
      .where('type', collectionType)
      .firstOrFail()

    await CollectionService.removeBooks({ collection, bookIds })

    const books = await CollectionService.getBooks({ collection })
    const authors = await CollectionService.getAuthors({ collection })

    return {
      books,
      authors,
    }
  }
}

function getCollectionType(collectionName: string) {
  switch (collectionName) {
    case 'wishlist':
      return CollectionType.WISHLIST
    case 'default':
      return CollectionType.DEFAULT
    default:
      throw new Error(`Invalid collection name: ${collectionName}`)
  }
}
