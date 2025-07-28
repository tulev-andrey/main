import { QueryParamsForAll, QueryParamsForSingle } from '../../types/query_params'
import Amo from '../Amo'
import { CreateResponse, Response, UpdateResponse } from '../../types/responses'
import logError from '../../utils/error'
import { CustomField } from '../../types/custom_fields'
import { EntitiesType, EntityClass, EntitiesFields, PartialExcept } from '../../types/entity'

export default class Entity<N extends EntitiesType, E extends EntitiesFields> implements EntityClass<E> {
  constructor(
    protected amo: Amo,
    protected type: N
  ) {
    this.url = 'api/v4/' + type
    this.limit = 250
  }

  readonly url: string
  readonly limit: number

  async get(params: QueryParamsForSingle = {}): Promise<E[] | null> {
    try {
      const response = await this.amo.instance.get<Response<N, E>>(this.url, {
        params
      })
      return response.data._embedded?.[this.type]
    } catch (error) {
      logError(`get ${this.type} error`, error)
      return null
    }
  }

  async getAll(params: QueryParamsForAll = {}, page = 1, acc: E[] = []): Promise<E[] | null> {
    try {
      const response = await this.amo.instance.get<Response<N, E>>(this.url, {
        params: {
          ...params,
          page,
          limit: this.limit
        }
      })
      const entity = response.data._embedded?.[this.type]
      if (!entity) return null
      const result = acc.concat(entity)
      if (entity.length === this.limit) {
        return this.getAll(params, ++page, result)
      }
      return result
    } catch (error) {
      logError(`get ${this.type} error`, error)
      return null
    }
  }

  getCustomFieldById(entity: E, id: number): CustomField | null {
    const field = entity.custom_fields_values?.find((field) => {
      if (field.field_id && field.field_id === id) return field
    })
    return field || null
  }

  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E {
    let newest = entities[0]
    for (const entity of entities) {
      if (entity[by] > newest[by]) newest = entity
    }
    return newest
  }

  async create(entities: Partial<E>[]) {
    try {
      const response = await this.amo.instance.post<Response<N, CreateResponse>>(this.url, entities)
      return response.data._embedded?.[this.type]
    } catch (error) {
      logError(`get ${this.type} error`, error)
      return null
    }
  }

  async update(entities: PartialExcept<E, 'id'>[]) {
    try {
      const response = await this.amo.instance.patch<Response<N, UpdateResponse>>(this.url, entities)
      return response.data._embedded?.[this.type]
    } catch (error) {
      logError(`get ${this.type} error`, error)
      return null
    }
  }
}
