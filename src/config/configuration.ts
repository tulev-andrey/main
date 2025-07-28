import dayjs from 'dayjs'

export default () => {
  const env = process.env.NODE_ENV
  return {
    env,
    postgres: {
      host: process.env.PG_DB_HOST,
      port: +process.env.PG_DB_PORT,
      username: process.env.PG_DB_USER,
      password: process.env.PG_DB_PASS,
      database: process.env.PG_DB_NAME,
      cert: process.env.DB_CERT
    }
  }
}

export const dateFormat = 'DD.MM.YYYY'
export const dataKeys = ['created_at', 'updated_at', 'closed_at']
export const arrayKeys = ['tags']
export const objectKeys = ['pipeline', 'status', 'responsible_user', 'loss_reason', 'created_by', 'updated_by']

export const filterType: { [key: string]: (value: any) => number | string } = {
  id: (id) => +id,
  name: (name): string => name.toString(),
  date: (date) => dayjs(date, dateFormat).unix(),
  timestamp: (timestamp) => +timestamp,
  '': (value) => value
}
