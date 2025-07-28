import { Module } from '@nestjs/common'
import { AmoCopyProcessService } from './amo-copy-process.service'
import { AmoCopyProcessController } from './amo-copy-process.controller'
import { LeadEntity } from '../../entities/lead.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PipelineEntity } from '../../entities/pipeline.entity'
import { StatusEntity } from '../../entities/status.entity'
import { LossReasonEntity } from '../../entities/loss_reason.entity'
import { UserEntity } from '../../entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LeadEntity, PipelineEntity, StatusEntity, UserEntity, LossReasonEntity])],
  providers: [AmoCopyProcessService],
  controllers: [AmoCopyProcessController]
})
export class AmoCopyProcessModule {}
