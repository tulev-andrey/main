import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { AmoCopyProcessModule } from './modules/amo-copy-process/amo-copy-process.module'
import { AppController } from './app.controller'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import * as _ from 'lodash'
import { GoogleSheetsModule } from './modules/google-sheets/google-sheets.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      async useFactory(configService: ConfigService) {
        const { cert, ...dbConfig } = configService.get('postgres')

        return {
          type: 'postgres',
          ssl: cert ? { ca: readFileSync(resolve(__dirname, `../${cert}`)) } : undefined,
          bigNumberStrings: false,
          autoLoadEntities: true,
          synchronize: true,
          migrationsRun: false,
          cache: false,
          extra: { connectionLimit: 10 },
          ..._.omit(dbConfig, 'postgres')
        } as TypeOrmModuleOptions
      },
      inject: [ConfigService]
    }),
    AmoCopyProcessModule,
    GoogleSheetsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
