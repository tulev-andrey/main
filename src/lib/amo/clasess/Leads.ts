import Amo from './Amo'
import { Lead } from '../types/lead'
import Entity from './base/Entity'

export default class Leads extends Entity<'leads', Lead> {
  constructor(protected amo: Amo) {
    super(amo, 'leads')
  }
}
