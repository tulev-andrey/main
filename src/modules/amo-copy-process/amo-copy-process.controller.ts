import { Controller, Get, Query, Res } from '@nestjs/common'
import { AmoCopyProcessService } from './amo-copy-process.service'
import { logger } from '../../helpers/logger'
import AmoController from '../../lib/amo'
import dayjs from 'dayjs'
import { Status } from '../../lib/amo/types/pipeline'
import { Response } from 'express'

@Controller('amo-copy-process')
export class AmoCopyProcessController {
  constructor(private service: AmoCopyProcessService) {}

  @Get('start')
  async start(@Res() res: Response, @Query('runGS') runGS: boolean = true) {
    logger.info('start')

    const amo = new AmoController(process.env.API_BASE_URL, process.env.API_TOKEN)
    logger.debug('amo instance created')

    const pipelineFromAmo = await amo.pipelines.getAll()
    logger.info('pipelines from amo', { pipelines: pipelineFromAmo })
    await this.service.savePipelines(pipelineFromAmo)
    logger.info('pipelines saved')

    const statuses = pipelineFromAmo.reduce((acc: Status[], pipeline) => [...acc, ...pipeline._embedded.statuses], [])
    logger.info('statuses from amo', { statuses })
    await this.service.saveStatuses(statuses)
    logger.info('statuses saved')

    const lossReasons = await amo.loss_reasons.getAll()
    logger.info('loss reasons from amo', { lossReasons })
    await this.service.saveLossReasons(lossReasons)
    logger.info('loss reasons saved')

    const users = await amo.users.getAll()
    logger.info('users from amo', { users })
    await this.service.saveUsers(users)
    logger.info('users saved')

    const pipelines = this.service.getPipelines()
    logger.info('pipelines', { pipelines })

    const startTime = dayjs().subtract(1, 'day').unix()
    const endTime = dayjs().unix()
    logger.info('interval', { startTime, endTime })

    for (const pipeline of pipelines) {
      const leads = await amo.leads.getAll({
        filter: { pipeline_id: pipeline, updated_at: { from: startTime, to: endTime } }
      })
      logger.info('leads for pipeline: ' + pipeline, { leads })

      if (!leads) continue

      await this.service.saveLeads(leads)
      logger.info('leads saved')
    }

    logger.info('run google-sheets/update-table')
    if (runGS) res.redirect('/google-sheets/update-table')
  }
}
