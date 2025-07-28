import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm'
import { Tag } from '../lib/amo/types/lead'
import { StatusEntity } from './status.entity'
import { PipelineEntity } from './pipeline.entity'
import { UserEntity } from './user.entity'
import { LossReasonEntity } from './loss_reason.entity'

@Entity({ name: `leads` })
@Unique(['external_id', 'account_id'])
export class LeadEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'bigint', nullable: false })
  external_id: number

  @Column({ type: 'bigint', nullable: false })
  account_id: number

  @Column({ type: 'text', nullable: false })
  name: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: UserEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_by_user_id' })
  updated_by: UserEntity

  @Column({ type: 'bigint', nullable: false })
  created_at: number

  @Column({ type: 'bigint', nullable: true })
  updated_at: number | null

  @Column({ type: 'bigint', nullable: true })
  closed_at: number | null

  @Column({ type: 'float', nullable: false })
  budget: number

  @Column({ type: 'bigint', nullable: true })
  source_id: number | null

  @Column({ type: 'jsonb', nullable: true })
  tags: Tag[] | null

  @Column({ type: 'jsonb', nullable: true })
  custom_values: Record<string, any> | null

  @ManyToOne(() => PipelineEntity)
  @JoinColumn({ name: 'pipeline_id' })
  pipeline: PipelineEntity

  @ManyToOne(() => StatusEntity)
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  responsible_user: UserEntity

  @ManyToOne(() => LossReasonEntity)
  @JoinColumn({ name: 'loss_reason_id' })
  loss_reason: LossReasonEntity
}
