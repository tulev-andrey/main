import { Controller, Get, ParseArrayPipe, Query } from '@nestjs/common'
import { GoogleSheetsService } from './google-sheets.service'
import GoogleSheets from '../../lib/google-sheets'
import { logger } from '../../helpers/logger'

@Controller('google-sheets')
export class GoogleSheetsController {
  constructor(private service: GoogleSheetsService) {}

  @Get('update-table')
  async updateTable(
    @Query('table_ids', new ParseArrayPipe({ items: String, separator: ',', optional: true })) tableIds: string[],
    @Query('table_names', new ParseArrayPipe({ items: String, separator: ',', optional: true })) tableNames: string[]
  ) {
    logger.info('start update table')

    if (!tableIds) {
      tableIds = process.env.TABLES?.split(',') || []
    }
    if (!tableNames) {
      tableNames = process.env.LISTS?.split(',') || []
    }

    logger.debug('table_ids', { tableIds })
    logger.debug('table_names', { tableNames })
    for (const tableId of tableIds) {
      const sheets = new GoogleSheets(tableId)
      logger.debug('instance created')
      for (const tableName of tableNames) {
        logger.debug(`get table with name "${tableName}"`)
        const gotRows = await sheets.get(tableName)
        if (!gotRows) {
          logger.warn(`table with name "${tableName}" not found`)
          continue
        }
        const firstRow = gotRows[0]
        logger.debug('firstRow', { firstRow })
        await sheets.delete(`${tableName}!2:${gotRows.length + 1}`)
        logger.debug('table deleted')
        const leads = await this.service.getLeads(firstRow)
        logger.info('get leads', { leads })
        const rows = this.service.convertToRows(firstRow, leads)
        logger.debug('get rows', { rows })
        await sheets.append(`${tableName}!A2:${rows.length + 1}`, rows)
        logger.info('table updated')
      }
    }
  }
}
