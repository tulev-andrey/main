import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { logger } from './helpers/logger'

async function bootstrap() {
  logger.info('Starting app')
  logger.info('Envs', { envs: process.env })
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))

  app.enableCors({
    origin: [/localhost/, /\.amocrm\.ru/, /\.amocrm\.com/, /\.kommo\.com/, /webhook\.site/],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap().catch((err) => {
  logger.error('Bootstrap failed', { err })
})
