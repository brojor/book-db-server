import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Author from 'App/Models/Author'
import Book from 'App/Models/Book'

export default class BooksController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ params }: HttpContextContract) {
    console.log('show book')
    console.log('id: ', params.id)
    const book = await Book.findOrFail(params.id)
    const author = await Author.findOrFail(book.authorId)

    return { ...book.serialize(), author: author.fullName }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
