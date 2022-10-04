import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Collection from 'App/Models/Collection'
import AuthValidator from 'App/Validators/AuthValidator'

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    const validCredentials = await request.validate(AuthValidator)
    const user = await User.create(validCredentials)
    await Collection.create({ userId: user.id, type: 1 })

    const { token } = await auth.login(user)

    return { token }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const { token } = await auth.attempt(email, password)
      return { token }
    } catch (e) {
      response.unauthorized({ error: 'Invalid credentials' })
    }
  }
}
