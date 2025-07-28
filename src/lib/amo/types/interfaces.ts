import { QueryParamsForAll, QueryParamsForSingle } from './query_params'

export interface EntityClass<E> {
  url: string
  limit: number
  get(params: QueryParamsForSingle): Promise<E[] | null>
  getAll(params: QueryParamsForAll, page: number, acc: E[]): Promise<E[] | null>
}
