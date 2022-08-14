import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const user = await User.create({ email, password })
    const { token } = await auth.login(user)

    return { token }
  }
}
