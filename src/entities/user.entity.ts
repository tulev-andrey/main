import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm'
import { LeadEntity } from './lead.entity'

@Entity({ name: `users` })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'bigint', nullable: false, unique: true })
  external_id: number

  @Column({ type: 'text', nullable: false })
  name: string

  @Column({ type: 'text', nullable: false })
  email: string

  @OneToMany(() => LeadEntity, (lead) => lead.responsible_user)
  @JoinColumn({ name: 'lead_id' })
  leads: LeadEntity[]
}
