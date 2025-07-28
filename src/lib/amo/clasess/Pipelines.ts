import Amo from './Amo'
import EntityGetOnly from './base/EntityGetOnly'
import { Pipeline } from '../types/pipeline'

export default class Pipelines extends EntityGetOnly<'pipelines', Pipeline> {
  constructor(protected amo: Amo) {
    super(amo, 'leads/pipelines')
  }
}
