import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BookState from 'App/Enums/BookState'
import Collection from 'App/Models/Collection'
import CollectionService from 'App/Services/CollectionService'
import BookToAddValidator from 'App/Validators/BookToAddValidator'

export default class CollectionsController {
  public async index({ params, request }: HttpContextContract) {
    const bookState = BookState[params.state as string] as BookState | undefined
    const collection = request['collection'] as Collection

    if (bookState === undefined && params.state !== 'library') {
      throw new Error(`Invalid book state: ${params.state}`)
    }

    return {
      books: await CollectionService.getBooks({ collection, bookState }),
      authors: await CollectionService.getAuthors({ collection, bookState }),
    }
  }

  public async store({ params, request }: HttpContextContract) {
    const bookState = BookState[params.state as keyof typeof BookState] || BookState.unread
    const bookToAdd = await request.validate(BookToAddValidator)

    await CollectionService.addBook({ collection: request['collection'] as Collection, book: bookToAdd, bookState })
  }

  public async update({ params, request }: HttpContextContract) {
    const { bookIds } = request.body()
    const bookState = BookState[params.state as keyof typeof BookState]
    if (!bookState) {
      throw new Error('Invalid bookState')
    }

    await CollectionService.setBookState({ collection: request['collection'] as Collection, bookIds, bookState })
  }

  public async destroy({ request }: HttpContextContract) {
    const { bookIds } = request.body()

    await CollectionService.removeBooks({ collection: request['collection'] as Collection, bookIds })
  }
}
