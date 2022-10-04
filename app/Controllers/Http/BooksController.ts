import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'

export default class BooksController {
  public async show({ params }: HttpContextContract) {
    return Book.findOrFail(params.id)
  }
}
