import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import ISBNService from 'App/Services/ISBNService'

// ošetřit pokud nenajde knihu

export default class IsbnsController {
  public async index({ request }: HttpContextContract) {
    const isbn = request.param('isbn')
    const book = await Book.findBy('isbn', isbn)
    const author = await book?.related('author').query().first()

    if (book) {
      return { ...book.serialize(), author: author?.fullName }
    }
    return ISBNService.getBookDetails(isbn)
  }
}
