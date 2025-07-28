import EntityGetOnly from './base/EntityGetOnly'
import Amo from './Amo'
import { User } from '../types/user'

export default class Users extends EntityGetOnly<'users', User> {
  constructor(protected amo: Amo) {
    super(amo, 'users')
  }
}
