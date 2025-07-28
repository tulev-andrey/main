import Amo from './Amo'
import { Contact } from '../types/contact'
import Entity from './base/Entity'
import { CustomField } from '../types/custom_fields'

export default class Contacts extends Entity<'contacts', Contact> {
  constructor(protected amo: Amo) {
    super(amo, 'contacts')
  }

  public getCustomFieldByCode(entity: Contact, code: 'PHONE' | 'EMAIL'): CustomField | null {
    const field = entity.custom_fields_values?.find((field) => {
      if (field.field_code && field.field_code === code) return field
    })
    return field || null
  }
}
