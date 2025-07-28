import { logger } from './logger'

export default function logError(name: string, error: any) {
  logger.error(name, {
    message: error.message,
    status: error.status,
    validation_errors: error.response?.data?.['validation-errors']?.[0]?.errors,
    error
  })
}
