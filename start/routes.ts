/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('register', 'AuthController.register')
Route.post('login', 'AuthController.login')

Route.get('collection/:state', 'CollectionsController.index').middleware('getUserCollection')
Route.post('collection/:state', 'CollectionsController.store').middleware('getUserCollection')
Route.delete('collection', 'CollectionsController.destroy').middleware('getUserCollection')
Route.put('collection/:state', 'CollectionsController.update').middleware('getUserCollection')

Route.get('books/:id', 'BooksController.show')

Route.get('/isbn/:isbn', 'IsbnsController.index')
