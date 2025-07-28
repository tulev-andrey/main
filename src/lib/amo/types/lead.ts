import { CustomField } from './custom_fields'

export interface Lead {
  id: number
  name: string
  price: number
  responsible_user_id: number
  group_id: number
  status_id: number
  pipeline_id: number
  loss_reason_id: number
  source_id: number
  created_by: number
  updated_by: number
  closed_at: number
  created_at: number
  updated_at: number
  closest_task_at: number
  is_deleted: boolean
  account_id: number
  custom_fields_values: CustomField[] | null
  _embedded?: LeadEmbedded
}

export interface LeadEmbedded {
  contacts?: EmbeddedContact[]
  companies?: EmbeddedCompany[]
  tags?: Tag[]
}

export interface EmbeddedContact {
  id: number
  is_main: boolean
}

export interface EmbeddedCompany {
  id: number
}

export interface Tag {
  id: number
  name: string
  color: string | null
}
