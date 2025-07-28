import Amo from './Amo'
import { Company } from '../types/company'
import Entity from './base/Entity'

export default class Companies extends Entity<'companies', Company> {
  constructor(protected amo: Amo) {
    super(amo, 'companies')
  }
}
