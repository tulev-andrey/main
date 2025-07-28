import Amo from './Amo'
import EntityGetOnly from './base/EntityGetOnly'
import { LossReason } from '../types/loss_reason'

export default class LossReasons extends EntityGetOnly<'loss_reasons', LossReason> {
  constructor(protected amo: Amo) {
    super(amo, 'leads/loss_reasons')
  }
}
