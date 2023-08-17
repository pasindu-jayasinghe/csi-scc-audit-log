import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'audit' })
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logDate: Date;

  @Column({ default: null })
  userName: string;

  @Column()
  description: string;

  @Column()
  action: string;

  @Column({ default: null })
  userType: string;

  @Column({ default: null })
  userId: string;

  @Column({ default: null })
  method: string;

  @Column({ default: null, type: 'text' })
  infor: string;

}
