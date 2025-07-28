import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm'
import { LeadEntity } from './lead.entity'
import { StatusEntity } from './status.entity'

@Entity({ name: `pipelines` })
@Unique(['external_id', 'account_id'])
export class PipelineEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'bigint', nullable: false })
  external_id: number

  @Column({ type: 'text', nullable: false })
  name: string

  @Column({ type: 'bigint', nullable: false })
  account_id: number

  @OneToMany(() => LeadEntity, (lead) => lead.pipeline)
  leads: LeadEntity[]

  @OneToMany(() => StatusEntity, (status) => status.pipeline)
  statuses: StatusEntity[]
}
