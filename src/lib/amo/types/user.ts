export interface User {
  id: number
  name: string
  email: string
  lang: string
  rights: {
    leads: RightSet
    contacts: RightSet
    companies: RightSet
    tasks: {
      edit: RightValue
      delete: RightValue
    }
    mail_access: boolean
    catalog_access: boolean
    status_rights: StatusRight[]
    is_admin: boolean
    is_free: boolean
    is_active: boolean
    group_id: number | null
    role_id: number | null
  }
  _links: {
    self: {
      href: string
    }
  }
  _embedded: {
    roles: Role[]
    groups: Group[]
  }
}

type RightValue = 'A' | 'D' | 'R' | 'M' | string

interface RightSet {
  view: RightValue
  edit: RightValue
  add: RightValue
  delete: RightValue
  export: RightValue
}

interface StatusRight {
  entity_type: string
  pipeline_id: number
  status_id: number
  rights: {
    view: RightValue
    edit: RightValue
    delete: RightValue
  }
}

interface Role {
  id: number
  name: string
  _links: {
    self: {
      href: string
    }
  }
}

interface Group {
  id: number
  name: string
}
