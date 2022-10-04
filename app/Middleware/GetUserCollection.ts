import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetUserCollection {
  protected async getUserCollection(ctx: HttpContextContract) {
    const user = await ctx.auth.use('api').authenticate()
    let collection = await user.related('collections').query().first()

    if (!collection && ctx.request.method() === 'POST') {
      collection = await user.related('collections').create({ type: 1 })
    }

    return collection
  }

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const collection = await this.getUserCollection(ctx)

    if (!collection) {
      throw new Error('User collection not found')
    }

    ctx.request['collection'] = collection
    await next()
  }
}
