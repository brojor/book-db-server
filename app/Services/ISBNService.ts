import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export default class ISBNService {
  protected static apiKey = Env.get('GOOGLE_API_KEY')
  protected static apiURL = 'https://www.googleapis.com/books/v1/volumes'

  public static async getBookDetails(isbn: number) {
    const params = new URLSearchParams({
      key: this.apiKey,
      q: `isbn:${isbn}`,
    })

    const { data } = await axios.get(`${this.apiURL}?${params}`)

    if (!data.totalItems) return null

    const book = data.items[0]
    const { title, subtitle, publishedDate, pageCount, language, publisher } = book.volumeInfo

    let author = book.volumeInfo.authors?.[0]
    if (!author) {
      const { data } = await axios.get(`${this.apiURL}/${book.id}`)
      author = data.volumeInfo.authors?.[0]
    }
    return { author, title, subtitle, pageCount, publisher, publishedDate, language }
  }
}
