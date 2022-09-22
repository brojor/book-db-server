import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

// { author, title, subtitle, isbn, pageCount, publisher, publishedDate, language }
// interface BookToAdd {
//   author: string
//   title: string
//   subtitle: string
//   pageCount: number
//   publisher: string
//   publishedDate: string
//   language: string
// }

// title + (subtitle), počet stran, rok vydání
// ošetřit pokud nenajde knihu

export default class IsbnsController {
  public async index({ request }: HttpContextContract) {
    const isbn = request.param('isbn')
    const params = new URLSearchParams({
      key: 'AIzaSyCvwEk7vYWnbxS7ZcLLSl9GhaudL_mkyA0',
      q: `isbn:${isbn}`,
    })
    const apiURL = `https://www.googleapis.com/books/v1/volumes`

    const { data } = await axios.get(`${apiURL}?${params}`)

    if (data.totalItems > 0) {
      const book = data.items[0]
      const { title, subtitle, publishedDate, pageCount, language, publisher } = book.volumeInfo
      console.log(JSON.stringify(book, null, 2))

      let author = book.volumeInfo.authors?.[0]
      if (!author) {
        const { data } = await axios.get(`${apiURL}/${book.id}`)
        author = data.volumeInfo.authors?.[0]
      }

      return { author, title, subtitle, pageCount, publisher, publishedDate, language }
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
