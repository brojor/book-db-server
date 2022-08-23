import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CollectionType from 'App/enums/CollectionType'
import Collection from 'App/Models/Collection'
import CollectionService from 'App/Services/CollectionService'

export default class AuthorsController {
  public async index({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!

    const collection = await Collection.firstOrCreate({
      userId: user.id,
      type: CollectionType.DEFAULT,
    })
    return await CollectionService.getAuthors({ collection })
  }
}
