import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
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

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'author.required': 'Bez jména autora se bohužel neobejdu.',
    'title.required': 'Uveďte prosím název knihy.',
  }
}
