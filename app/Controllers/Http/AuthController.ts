import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      password: schema.string([rules.minLength(8)]),
    })

    const validCredentials = await request.validate({ schema: userSchema })
    const user = await User.create(validCredentials)

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
