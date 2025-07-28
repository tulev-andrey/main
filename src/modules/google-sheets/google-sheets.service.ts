import { InjectRepository } from '@nestjs/typeorm'
import { LeadEntity } from '../../entities/lead.entity'
import { In, Raw, Repository } from 'typeorm'
import { arrayKeys, dataKeys, filterType, objectKeys } from '../../config/configuration'
import { dateFormat } from '../../config/configuration'
import dayjs from 'dayjs'
import { Tag } from '../../lib/amo/types/lead'

export class GoogleSheetsService {
  constructor(
    @InjectRepository(LeadEntity)
    private leadRepository: Repository<LeadEntity>
  ) {}

  async getLeads(keys: string[] = []) {
    const where = {}
    for (const key of keys) {
      if (!key) continue

      const [, entity, filter] = key.match(/(\w+)(?:\[(.+)])?/)

      if (!filter) continue

      const [filterBy, ...filterValue] = filter.split(':')

      if (entity === 'custom_values') {
        for (const filter of filterValue) {
          if (+filter) {
            where[entity] = Raw((alias) => `${alias} ? '${filter}'`)
          } else {
            const [, fieldId, values] = filter.match(/(\d+)-(.+)/)
            const jsonb = JSON.stringify({ [fieldId]: values.split(',') })
            where[entity] = Raw((alias) => `${alias} @> :jsonb`, { jsonb })
          }
        }
        continue
      }

      if (arrayKeys.includes(entity)) {
        for (const filter of filterValue) {
          const jsonb = JSON.stringify([{ [filterBy || 'name']: filter }])
          where[entity] = Raw((alias) => `${alias} @> :jsonb`, { jsonb })
        }
        continue
      }

      const formatedValues = filterValue.map(filterType[filterBy])

      where[entity === 'id' ? 'external_id' : entity] = {
        [filterBy === 'id' ? 'external_id' : filterBy]: In(formatedValues)
      }
    }

    return await this.leadRepository.find({ where, relations: objectKeys })
  }

  convertToRows(firstRowCells: any[], leads: LeadEntity[]) {
    const rows = []

    for (const lead of leads) {
      const row = []

      firstRowCells.forEach((cell, index) => {
        if (!cell) return
        const [, entity, whatNeed = 'name'] = cell.match(/(\w+)(?:\[.+])?(?:\((.+)\))?/)
        if (dataKeys.includes(entity)) {
          return (row[index] = whatNeed === 'date' && lead[entity] ? dayjs(lead[entity] * 1000).format(dateFormat) : '')
        }
        if (arrayKeys.includes(entity)) {
          return (row[index] = lead[entity].map((tag: Tag[]) => tag[whatNeed]).join(', '))
        }
        if (objectKeys.includes(entity)) {
          const key = whatNeed === 'id' ? 'external_id' : whatNeed
          return (row[index] = lead[entity]?.[key])
        }
        if (entity === 'custom_values') {
          return (row[index] = lead[entity][whatNeed]?.join(', '))
        }
        row[index] = lead[entity === 'id' ? 'external_id' : entity]
      })

      rows.push(row)
    }
    return rows
  }
}
