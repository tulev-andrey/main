import { CustomField } from './custom_fields'

export interface Contact {
  id: number
  name: string
  first_name: string
  last_name: string
  responsible_user_id: number
  group_id: number
  created_by: number
  updated_by: number
  created_at: number
  updated_at: number
  closest_task_at: number | null
  custom_fields_values: CustomField[] | null
  account_id: number
  _embedded: ContactEmbedded
}

export interface ContactEmbedded {
  leads?: EmbeddedLead[]
  companies?: EmbeddedCompany[]
  tags?: Tag[]
}

export interface EmbeddedLead {
  id: number
}

export interface EmbeddedCompany {
  id: number
}

export interface Tag {
  id: number
  name: string
  color: string | null
}
