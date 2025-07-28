export interface CustomField {
  field_id?: number
  field_code?: 'PHONE' | 'EMAIL'
  values: {
    value: any
    enum_id?: number
    enum_code?: string
  }[]
}
