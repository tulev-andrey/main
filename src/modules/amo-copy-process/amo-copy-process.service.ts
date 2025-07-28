import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LeadEntity } from '../../entities/lead.entity'
import { Repository } from 'typeorm'
import { Lead } from '../../lib/amo/types/lead'
import { PipelineEntity } from '../../entities/pipeline.entity'
import { Pipeline, Status } from '../../lib/amo/types/pipeline'
import { StatusEntity } from '../../entities/status.entity'
import { LossReasonEntity } from '../../entities/loss_reason.entity'
import { UserEntity } from '../../entities/user.entity'
import { LossReason } from '../../lib/amo/types/loss_reason'
import { User } from '../../lib/amo/types/user'

@Injectable()
export class AmoCopyProcessService {
  constructor(
    @InjectRepository(LeadEntity)
    private leadRepository: Repository<LeadEntity>,
    @InjectRepository(PipelineEntity)
    private pipelineRepository: Repository<PipelineEntity>,
    @InjectRepository(StatusEntity)
    private statusRepository: Repository<StatusEntity>,
    @InjectRepository(LossReasonEntity)
    private lossReasonRepository: Repository<LossReasonEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async saveLeads(leads: Lead[]) {
    const entities: LeadEntity[] = []
    for (const lead of leads) {
      const custom_values = {}

      lead.custom_fields_values?.forEach((field) => {
        custom_values[field.field_id] = field.values.map((value) => value.value)
      })

      const pipeline = await this.pipelineRepository.findOneBy({ external_id: lead.pipeline_id })
      const status = await this.statusRepository.findOneBy({ external_id: lead.status_id })
      const responsible_user = await this.userRepository.findOneBy({ external_id: lead.responsible_user_id })
      const created_by = await this.userRepository.findOneBy({ external_id: lead.created_by })
      const updated_by = await this.userRepository.findOneBy({ external_id: lead.updated_by })
      const loss_reason = lead.loss_reason_id
        ? await this.lossReasonRepository.findOneBy({ external_id: lead.loss_reason_id })
        : null

      entities.push(
        this.leadRepository.create({
          external_id: lead.id,
          account_id: lead.account_id,
          name: lead.name,
          created_by,
          updated_by,
          created_at: lead.created_at,
          updated_at: lead.updated_at,
          closed_at: lead.closed_at,
          budget: lead.price,
          source_id: lead.source_id,
          tags: lead._embedded.tags,
          custom_values,
          pipeline,
          status,
          responsible_user,
          loss_reason
        })
      )
    }
    return this.leadRepository.upsert(entities, ['external_id', 'account_id'])
  }

  async savePipelines(pipelines: Pipeline[]) {
    const entities: PipelineEntity[] = []
    for (const pipeline of pipelines) {
      entities.push(
        this.pipelineRepository.create({
          external_id: pipeline.id,
          account_id: pipeline.account_id,
          name: pipeline.name
        })
      )
    }
    return this.pipelineRepository.upsert(entities, ['external_id', 'account_id'])
  }

  async saveStatuses(statuses: Status[]) {
    const entities: StatusEntity[] = []
    for (const status of statuses) {
      entities.push(
        this.statusRepository.create({
          external_id: status.id,
          name: status.name,
          account_id: status.account_id
        })
      )
    }
    return this.statusRepository.upsert(entities, ['external_id', 'account_id', 'pipeline'])
  }

  async saveLossReasons(lossReasons: LossReason[]) {
    const entities: LossReasonEntity[] = []
    for (const lossReason of lossReasons) {
      entities.push(
        this.lossReasonRepository.create({
          external_id: lossReason.id,
          name: lossReason.name,
          created_at: lossReason.created_at,
          updated_at: lossReason.updated_at
        })
      )
    }
    return this.lossReasonRepository.upsert(entities, ['external_id'])
  }

  async saveUsers(users: User[]) {
    const entities: UserEntity[] = []
    for (const user of users) {
      entities.push(
        this.userRepository.create({
          external_id: user.id,
          name: user.name,
          email: user.email
        })
      )
    }
    return this.userRepository.upsert(entities, ['external_id'])
  }

  getPipelines() {
    const pipelinesRaw = process.env.PIPELINES
    return pipelinesRaw.split(',').map((p) => +p.trim())
  }
}
