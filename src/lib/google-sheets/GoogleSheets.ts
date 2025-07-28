import { google, sheets_v4 } from 'googleapis'
import * as fs from 'fs'
import { resolve, dirname } from 'path'
import { logger } from '../../helpers/logger'

export default class GoogleSheets {
  public sheets: sheets_v4.Sheets

  constructor(
    private readonly spreadsheetId: string,
    private readonly auth?: { client_email: string; private_key: string }
  ) {
    if (!this.auth) {
      try {
        const path = resolve(dirname(require.main.filename) + '/keys/credentials.b64')
        const credentials = fs.readFileSync(path, { encoding: 'utf8' })
        this.auth = JSON.parse(Buffer.from(credentials, 'base64').toString('utf-8'))
      } catch (error) {
        logger.error('get credentials error', { error })
        this.auth = JSON.parse(process.env.GSS_SA_JSON_CREDENTIALS)
      }
    }

    const token = new google.auth.JWT({
      email: this.auth.client_email,
      key: this.auth.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    this.sheets = google.sheets({ version: 'v4', auth: token })
  }

  async get(range: string) {
    try {
      const res = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range
      })
      return res.data.values
    } catch (error) {
      logger.error('get range error', { range, error })
    }
  }

  async append(range: string, values: any[][]) {
    try {
      const res = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values
        }
      })
      return res.data
    } catch (error) {
      logger.error('append range error', { range, values, error })
    }
  }

  async update(range: string, values: any[][]) {
    try {
      const res = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values
        }
      })
      return res.data
    } catch (error) {
      logger.error('update range error', { range, values, error })
    }
  }

  async delete(range: string) {
    try {
      const res = await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range
      })
      return res.data
    } catch (error) {
      logger.error('delete range error', { range, error })
    }
  }
}
