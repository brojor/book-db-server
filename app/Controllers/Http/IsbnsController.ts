import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ISBNService from 'App/Services/ISBNService'
// ošetřit pokud nenajde knihu

export default class IsbnsController {
  public async index({ request }: HttpContextContract) {
    const isbn = request.param('isbn')
    return ISBNService.getBookDetails(isbn)
  }
}
