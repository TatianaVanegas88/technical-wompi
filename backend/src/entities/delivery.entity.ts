import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('deliveries')
export class DeliveryEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  customerId!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column({ nullable: true })
  notes?: string;

  @Column()
  status!: string;

  @Column()
  createdAt!: Date;
}