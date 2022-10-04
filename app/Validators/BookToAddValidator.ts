import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BookToAddValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    author: schema.string({ trim: true }),
    title: schema.string({ trim: true }),
    subtitle: schema.string.optional({ trim: true }),
    isbn: schema.number.optional(),
    pageCount: schema.number.optional(),
    publisher: schema.string.optional({ trim: true }),
    publishedDate: schema.string.optional(),
    language: schema.string.optional(),
  })

  public messages = this.ctx.i18n.validatorMessages('validator.bookToAdd')
}
