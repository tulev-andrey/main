import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { LeadEntity } from './lead.entity'

@Entity({ name: `loss_reasons` })
export class LossReasonEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'bigint', nullable: false, unique: true })
  external_id: number

  @Column({ type: 'text', nullable: false })
  name: string

  @Column({ type: 'bigint', nullable: false })
  created_at: number

  @Column({ type: 'bigint', nullable: false })
  updated_at: number

  @OneToMany(() => LeadEntity, (lead) => lead.loss_reason)
  leads: LeadEntity[]
}
