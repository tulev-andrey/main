import { QueryParamsForAll, QueryParamsForSingle } from '../../types/query_params'
import Amo from '../Amo'
import { ResponseGetOnly } from '../../types/responses'
import logError from '../../utils/error'

export type EntitiesGetOnlyType = 'pipelines' | 'leads/pipelines' | 'users' | 'loss_reasons' | 'leads/loss_reasons'

export interface EntityGetOnlyClass<E> {
  url: string
  limit: number
  get(params: QueryParamsForSingle): Promise<E[] | null>
  getAll(params: QueryParamsForAll, page: number, acc: E[]): Promise<E[] | null>
}

export default class EntityGetOnly<N extends EntitiesGetOnlyType, E> implements EntityGetOnlyClass<E> {
  constructor(
    protected amo: Amo,
    protected type: EntitiesGetOnlyType
  ) {
    this.url = 'api/v4/' + type
    this.limit = 100

    if (/\//.test(type)) {
      const splited = type.split('/')
      this.type = splited[splited.length - 1] as EntitiesGetOnlyType
    }
  }

  readonly url: string
  readonly limit: number

  async get(params: QueryParamsForSingle = {}): Promise<E[] | null> {
    try {
      const response = await this.amo.instance.get<ResponseGetOnly<N, E>>(this.url, {
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
      const response = await this.amo.instance.get<ResponseGetOnly<N, E>>(this.url, {
        params: {
          ...params,
          page,
          limit: this.limit
        }
      })
      const entity = response.data._embedded[this.type]
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
}
