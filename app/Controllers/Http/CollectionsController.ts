import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookState from 'App/enums/BookState'
import Collection from 'App/Models/Collection'
import CollectionService from 'App/Services/CollectionService'
import BookToAddValidator from 'App/Validators/BookToAddValidator'

export default class CollectionsController {
  public async index({ params, auth }: HttpContextContract) {
    const bookState = BookState[params.state as string] as BookState | undefined

    if (bookState === undefined && params.state !== 'library') {
      throw new Error(`Invalid book state: ${params.state}`)
    }

    const user = await auth.use('api').authenticate()

    const collection = await Collection.firstOrCreate({ userId: user.id, type: 1 })

    return {
      books: await CollectionService.getBooks({ collection, bookState }),
      authors: await CollectionService.getAuthors({ collection, bookState }),
    }
  }

  public async store({ params, auth, request }: HttpContextContract) {
    const bookState = BookState[params.state as keyof typeof BookState] || BookState.unread

    const user = await auth.use('api').authenticate()

    const collection = await Collection.firstOrCreate({ userId: user.id, type: 1 })
    const bookToAdd = await request.validate(BookToAddValidator)
    await CollectionService.addBook({ collection, book: bookToAdd, bookState })
  }

  public async update({ params, request, auth }: HttpContextContract) {
    const user = await auth.use('api').authenticate()
    const { bookIds } = request.body()
    const bookState = BookState[params.state as keyof typeof BookState]
    if (!bookState) {
      throw new Error('Invalid bookState')
    }

    const collection = await Collection.findByOrFail('userId', user.id)
    await CollectionService.setBookState({ collection, bookIds, bookState })
  }

  public async destroy({ auth, request }: HttpContextContract) {
    const user = await auth.use('api').authenticate()
    const { bookIds } = request.body()

    const collection = await Collection.findByOrFail('userId', user.id)
    await CollectionService.removeBooks({ collection, bookIds })
  }
}
