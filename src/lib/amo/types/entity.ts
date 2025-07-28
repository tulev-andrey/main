import { QueryParamsForAll, QueryParamsForSingle } from './query_params'
import { CustomField } from './custom_fields'
import { CreateResponse, UpdateResponse } from './responses'

export type EntitiesType = 'leads' | 'contacts' | 'companies'

export interface EntityClass<E extends EntitiesFields> {
  url: string
  limit: number
  get(params: QueryParamsForSingle): Promise<E[] | null>
  getAll(params: QueryParamsForAll, page: number, acc: E[]): Promise<E[] | null>
  create(entities: Partial<E>[]): Promise<CreateResponse[] | null>
  update(entities: PartialExcept<E, 'id'>[]): Promise<UpdateResponse[] | null>
  getCustomFieldById(entity: E, id: number): CustomField | null
  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E
}

export interface EntitiesFields {
  id?: number
  created_at: number
  updated_at: number
  custom_fields_values: CustomField[] | null
}

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>
