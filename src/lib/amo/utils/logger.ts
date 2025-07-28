import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.errors({ stack: true }), format.splat(), format.json()),
  transports: [new transports.Console()],
  exitOnError: false,
  handleExceptions: true
})
