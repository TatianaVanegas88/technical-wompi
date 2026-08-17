import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  reference!: string;

  @Column('integer')
  amount!: number;

  @Column()
  email!: string;

  @Column()
  status!: string;

  @Column({ nullable: true })
  customerId?: string;

  @Column({ nullable: true })
  deliveryId?: string;

  @Column()
  createdAt!: Date;

  @Column({ nullable: true })
  wompiTransactionId?: string;
}