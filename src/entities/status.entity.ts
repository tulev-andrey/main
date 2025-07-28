import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm'
import { PipelineEntity } from './pipeline.entity'
import { LeadEntity } from './lead.entity'

@Entity({ name: `statuses` })
@Unique(['external_id', 'account_id', 'pipeline'])
export class StatusEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'bigint', nullable: false })
  external_id: number

  @Column({ type: 'text', nullable: false })
  name: string

  @Column({ type: 'bigint', nullable: false })
  account_id: number

  @ManyToOne(() => PipelineEntity)
  @JoinColumn({ name: 'pipeline_id' })
  pipeline: PipelineEntity

  @OneToMany(() => LeadEntity, (lead) => lead.status)
  leads: LeadEntity[]
}
