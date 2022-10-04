import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'
import ISBNService from 'App/Services/ISBNService'

export default class IsbnsController {
  public async index({ request, response }: HttpContextContract) {
    const isbn = request.param('isbn')
    const book = await Book.findBy('isbn', isbn)
    const author = await book?.related('author').query().first()

    if (book) {
      return { ...book.serialize(), author: author?.fullName }
    }
    const bookDetails = await ISBNService.getBookDetails(isbn)
    if (!bookDetails) return response.status(404).send('ISBN not found')
    return { ...bookDetails, isbn }
  }
}
