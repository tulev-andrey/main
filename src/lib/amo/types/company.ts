import { CustomField } from './custom_fields'

export interface Company {
  id: number
  name: string
  responsible_user_id: number
  group_id: number
  created_by: number
  updated_by: number
  created_at: number
  updated_at: number
  closest_task_at: number | null
  custom_fields_values: CustomField[] | null
  account_id: number
  _embedded: CompanyEmbedded
}

export interface CompanyEmbedded {
  leads?: EmbeddedLead[]
  contacts?: EmbeddedContact[]
  tags?: Tag[]
}

export interface EmbeddedLead {
  id: number
}

export interface EmbeddedContact {
  id: number
}

export interface Tag {
  id: number
  name: string
  color: string | null
}
