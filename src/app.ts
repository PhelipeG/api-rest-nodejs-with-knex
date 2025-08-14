import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoute } from './routes/transactions'

export const app = fastify({
  logger: true
})

app.register(cookie)

// Health check route
app.get('/', async (request, reply) => {
  return { message: 'API is running!' }
})

app.register(transactionsRoute, {
  prefix: 'transactions',
})