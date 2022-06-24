import Koa from 'koa'
import { errors, restify } from 'middlewares'
import { v1 } from 'routes'

const app = new Koa()

app
  .use(errors)
  .use(restify)
  .use(v1.routes())

export { app }