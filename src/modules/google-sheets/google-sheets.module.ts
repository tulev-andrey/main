import { Module } from '@nestjs/common'
import { GoogleSheetsController } from './google-sheets.controller'
import { GoogleSheetsService } from './google-sheets.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LeadEntity } from '../../entities/lead.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LeadEntity])],
  controllers: [GoogleSheetsController],
  providers: [GoogleSheetsService]
})
export class GoogleSheetsModule {}
